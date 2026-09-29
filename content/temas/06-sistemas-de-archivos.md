---
slug: sistemas-de-archivos
orden: 6
titulo: "Sistemas de archivos"
resumen: "Aprenderás a crear VFAT, ext4 y XFS, montar NFS y autofs, ampliar volúmenes y diagnosticar permisos."
dias: [3, 6, 9]
---

## En palabras simples

El sistema de archivos es el formato de un cuaderno: XFS, ext4 o VFAT ordenan las páginas de manera distinta.
NFS es una carpeta compartida por red, como un armario común en la oficina.
autofs es un portero que abre ese armario solo cuando alguien lo necesita, y lo cierra si nadie lo usa.
SGID, sticky bit y ACL son reglas extra en la puerta: quién hereda el grupo, quién puede borrar y quién tiene permisos especiales.

## Comandos clave

### Crear y montar sistemas de archivos

```bash
mkfs.xfs /dev/vdb1                  # XFS, el predeterminado (mínimo ~300 MiB)
mkfs.ext4 -L backup /dev/vdb2       # ext4 con etiqueta
mkfs.vfat -n USB /dev/vdb3          # VFAT (paquete dosfstools, de BaseOS)
mount /dev/vdb1 /mnt/xfs            # montaje manual
# en /etc/fstab:  UUID=...  /mnt/fat  vfat  defaults  0 0
```

### Ampliar un LV y su sistema de archivos

```bash
lvextend -r -L +300M /dev/vgdatos/lvdatos   # amplía el LV y el FS juntos
lvextend -r -L 1G /dev/vgdatos/lvdatos      # hasta 1 GiB en total
vgextend vgdatos /dev/vdc1                  # si el VG no tiene espacio
# a mano: xfs_growfs /datos (XFS)  o  resize2fs /dev/vgdatos/lvdatos (ext4)
```

### NFS como cliente

```bash
dnf install -y nfs-utils
showmount -e servidor.ejemplo.com           # qué exporta (usa NFSv3; con NFSv4 puro puede fallar)
mkdir /mnt/nfs
mount -t nfs servidor.ejemplo.com:/export /mnt/nfs
# en /etc/fstab:
# servidor.ejemplo.com:/export  /mnt/nfs  nfs  defaults,_netdev  0 0
```

### autofs

```bash
dnf install -y autofs
vim /etc/auto.master.d/remoto.autofs
# /remoto   /etc/auto.remoto
vim /etc/auto.remoto
# compartido   -fstype=nfs4,rw   servidor.ejemplo.com:/export
systemctl enable --now autofs
ls /remoto/compartido                        # se monta al entrar
```

Mapa comodín para homes remotos:

```bash
# /etc/auto.master.d/home.autofs:   /home/remoto   /etc/auto.home
# /etc/auto.home:                   *   -rw   servidor.ejemplo.com:/home/&
```

### Permisos especiales, umask y ACL

```bash
chmod g+s /srv/ventas            # SGID: los archivos heredan el grupo
chmod o+t /srv/comun             # sticky: solo el dueño borra lo suyo
chmod 3770 /srv/ventas           # SGID + sticky + rwx dueño y grupo
umask                            # máscara actual (0022 es lo habitual)
umask 027                        # nuevos archivos 640, carpetas 750
setfacl -m u:ana:rw /srv/informe.txt   # permiso extra para ana
setfacl -m d:g:ventas:rwx /srv/ventas  # ACL por defecto para lo nuevo
getfacl /srv/informe.txt         # ver ACL (ls -l muestra un +)
setfacl -x u:ana /srv/informe.txt      # quitar la entrada
```

### Fuera del examen RHEL 10

Samba, FTP y los contenedores con Podman aparecen en guías de versiones anteriores, pero están fuera del examen RHEL 10.

## Así lo piden en el examen

- "Amplía `lvdatos` a 850 MiB sin perder datos": `lvextend -r -L 850M` y revisa con `df -h`.
- "Configura autofs para que `/rhome/user1` monte `servidor:/rhome/user1`": master en `auto.master.d`, mapa con `*` y `&`, y `enable --now autofs`.
- "Crea `/common/admin` con grupo `admins`, que los archivos nuevos hereden el grupo y nadie ajeno entre": `chgrp`, `chmod 2770`.
- "Da a `natasha` lectura y escritura sobre `/var/tmp/fstab`, sin que `harry` tenga acceso": `setfacl -m u:natasha:rw` y `setfacl -m u:harry:-`.

## Errores típicos

- Olvidar `-r` en `lvextend`: el LV crece pero el sistema de archivos no.
- Intentar achicar XFS: no se puede.
- Crear un XFS de menos de 300 MiB: `mkfs.xfs` de RHEL 10 lo rechaza. Usa ext4 o un tamaño mayor.
- Olvidar `_netdev` en NFS dentro de fstab o no habilitar `autofs` al arranque.
- Crear la carpeta del punto de autofs a mano: autofs la gestiona solo.
- Poner SGID en un archivo en vez de en la carpeta.

## Chequeo rápido

- `df -hT` muestra tipo y tamaño de cada montaje.
- `cd /remoto/compartido && mount | grep remoto` confirma que autofs montó.
- `getfacl` y `ls -ld` muestran ACL y bits especiales.
