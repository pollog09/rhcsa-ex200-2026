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
sudo mkdir -p /shared /home/guests/ldapuser1
echo "hola desde NFS" | sudo tee /shared/leeme.txt
echo "/shared       *(rw,sync)" | sudo tee -a /etc/exports
echo "/home/guests  *(rw,sync)" | sudo tee -a /etc/exports
sudo systemctl enable --now nfs-server
sudo firewall-cmd --permanent --add-service={nfs,mountd,rpc-bind}
sudo firewall-cmd --reload

# Servir un repositorio con el contenido de la ISO (para practicar .repo)
sudo dnf install -y httpd
sudo mkdir -p /var/www/html/rhel10
sudo mount /dev/sr0 /mnt && sudo cp -a /mnt/. /var/www/html/rhel10/
sudo systemctl enable --now httpd
sudo firewall-cmd --permanent --add-service=http && sudo firewall-cmd --reload
```

En `servera` podrás usar `http://serverb/rhel10/BaseOS` y `http://serverb/rhel10/AppStream` como repos, y `serverb:/shared` como exportación NFS.

## 5. Nombres usados en los ejercicios

Los ejercicios usan nombres de ejemplo como `servera.lab.example.com`, `repo.lab.example.com` o `172.25.250.10`. **Cámbialos por los de tu laboratorio.** Lo importante es la técnica, no el nombre.

## 6. Tu rutina de práctica

1. Lee el **tema** del día y su chuleta de comandos.
2. Haz las **tareas prácticas** de ese tema sin mirar la solución.
3. **Reinicia** la VM y ejecuta los comandos de verificación.
4. Una vez por semana, restaura el snapshot y haz un **simulacro** completo de 3 horas.
