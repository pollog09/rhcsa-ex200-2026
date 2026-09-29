Para aprobar el EX200 tienes que **practicar con las manos**. Leer no alcanza. Esta es la forma más simple de montar un laboratorio parecido al del examen.

## 1. Consigue RHEL 10 gratis

1. Crea una cuenta en [developers.redhat.com](https://developers.redhat.com/register). La suscripción *Red Hat Developer for Individuals* es gratuita.
2. Descarga la ISO de **RHEL 10** (DVD completo, x86_64; si tu Mac tiene chip Apple, descarga la versión aarch64).
3. Usa VirtualBox, VMware, UTM (Mac) o KVM/virt-manager (Linux).

> Si no quieres registrarte, **AlmaLinux 10** o **Rocky Linux 10** son compatibles con RHEL y sirven para practicar casi todo.

## 2. Crea dos máquinas virtuales

| VM | Uso | Recursos |
|---|---|---|
| `servera` | Donde haces las tareas | 2 vCPU, 2-3 GB RAM, disco de 20 GB **+ 2 discos extra de 5 GB** |
| `serverb` | Servidor de apoyo (NFS, repos, SSH) | 1 vCPU, 2 GB RAM, 20 GB |

- Pon las dos VMs en la **misma red** (red interna o *host-only*) para que se vean entre sí.
- Instala con el perfil **Server** (sin entorno gráfico) o *Server with GUI* si quieres practicar Flatpak.
- Los discos extra aparecerán como `/dev/sdb` y `/dev/sdc` (VirtualBox/VMware) o `/dev/vdb` y `/dev/vdc` (KVM). Compruébalo con `lsblk`.

## 3. Toma un snapshot limpio

Antes de practicar, haz un **snapshot** de cada VM llamado `limpio`. Después de cada simulacro vuelves a él y empiezas desde cero.

## 4. Prepara `serverb` como servidor de apoyo

```bash
# Exportar /home/guests y /shared por NFS (para practicar montaje y autofs)
sudo dnf install -y nfs-utils
sudo mkdir -p /shared /home/guests/ldapuser01
# Dueño del home remoto: el mismo UID que tendrá el usuario en servera
sudo useradd -u 1501 -M -d /home/guests/ldapuser01 ldapuser01
sudo chown ldapuser01: /home/guests/ldapuser01
echo "hola desde NFS" | sudo tee /shared/leeme.txt
echo "/shared       *(rw,sync)" | sudo tee -a /etc/exports
echo "/home/guests  *(rw,sync)" | sudo tee -a /etc/exports
sudo systemctl enable --now nfs-server
sudo exportfs -rv                      # comprueba lo que se exporta
# nfs = NFSv4 (puerto 2049); mountd y rpc-bind hacen falta para showmount
sudo firewall-cmd --permanent --add-service={nfs,mountd,rpc-bind}
sudo firewall-cmd --reload

# Servir un repositorio con el contenido de la ISO (para practicar .repo)
# La ISO debe estar conectada a la unidad de CD/DVD de serverb
sudo dnf install -y httpd
sudo mkdir -p /var/www/html/rhel10
sudo mount -o ro /dev/sr0 /mnt
# cp -r (no cp -a): así los archivos no conservan el contexto SELinux de la ISO
sudo cp -r /mnt/. /var/www/html/rhel10/
sudo umount /mnt
sudo restorecon -R /var/www/html/rhel10   # contexto httpd_sys_content_t
sudo systemctl enable --now httpd
sudo firewall-cmd --permanent --add-service=http && sudo firewall-cmd --reload
```

En `servera`, agrega `serverb` a `/etc/hosts` (o usa su IP) y crea `/etc/yum.repos.d/lab.repo`:

```ini
[lab-baseos]
name=Lab BaseOS
baseurl=http://serverb/rhel10/BaseOS
gpgcheck=1
gpgkey=file:///etc/pki/rpm-gpg/RPM-GPG-KEY-redhat-release

[lab-appstream]
name=Lab AppStream
baseurl=http://serverb/rhel10/AppStream
gpgcheck=1
gpgkey=file:///etc/pki/rpm-gpg/RPM-GPG-KEY-redhat-release
```

Prueba con `dnf repolist` y `dnf install -y autofs`. `serverb:/shared` queda como exportación NFS.

Para el ejercicio de autofs con homes remotos, en el examen los usuarios suelen venir de LDAP. En casa, simúlalo creando en `servera` un usuario local con el **mismo UID** que en `serverb` y el home en la ruta que montará autofs (sin crear la carpeta):

```bash
sudo useradd -u 1501 -M -d /home/guests/ldapuser01 ldapuser01
echo 'redhat' | sudo passwd --stdin ldapuser01
# Solo si vas a entrar por SSH con ese usuario (el home está en NFS):
sudo setsebool -P use_nfs_home_dirs on
``` En AlmaLinux o Rocky la clave tiene otro nombre: mira `ls /etc/pki/rpm-gpg/`.

## 5. Nombres usados en los ejercicios

Los ejercicios usan nombres de ejemplo como `servera.lab.example.com`, `repo.lab.example.com` o `172.25.250.10`. **Cámbialos por los de tu laboratorio.** Lo importante es la técnica, no el nombre.

## 6. Tu rutina de práctica

1. Lee el **tema** del día y su chuleta de comandos.
2. Haz las **tareas prácticas** de ese tema sin mirar la solución.
3. **Reinicia** la VM y ejecuta los comandos de verificación.
4. Una vez por semana, restaura el snapshot y haz un **simulacro** completo de 3 horas.
