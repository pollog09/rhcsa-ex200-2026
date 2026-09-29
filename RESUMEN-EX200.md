# Resumen RHCSA EX200 (RHEL 10), versión corta

El **EX200** es el examen para obtener el **RHCSA** (Red Hat Certified System Administrator). Es **100% práctico**: te dan máquinas virtuales y una lista de tareas, con **~3 horas** de tiempo, sin internet, y se aprueba con **210 de 300** puntos. Todo se corrige **después de reiniciar**, así que cada cambio tiene que ser **persistente**.

Versión completa, con comandos y ejercicios, en el sitio (`/temas`).

| # | Dominio | En palabras simples | Comandos clave |
|---|---|---|---|
| 1 | Herramientas esenciales | Moverte por la terminal: archivos, redirecciones, buscar texto, comprimir, enlaces y permisos. | `grep` `find` `tar -czf/-cjf` `ln -s` `chmod` `chown` `man -k` |
| 2 | Software | Decirle al sistema de dónde sacar paquetes e instalarlos (RPM con dnf y apps con Flatpak). | `/etc/yum.repos.d/*.repo` `dnf install/remove` `rpm -qf` `flatpak remote-add` `flatpak install` |
| 3 | Scripts | Guardar comandos en un archivo que toma decisiones (`if`), repite (`for`) y recibe argumentos (`$1`). | `#!/bin/bash` `if [ ]` `for` `$1 $#` `$(cmd)` `exit 1` |
| 4 | Operar el sistema | Arrancar, apagar, cambiar de target, recuperar root, controlar procesos, leer logs y copiar por red. | `systemctl isolate` `rd.break` `top` `kill` `nice/renice` `tuned-adm` `journalctl` `scp` |
| 5 | Almacenamiento local | Particionar discos GPT y usar LVM (PV, VG, LV). Montar por UUID y agregar swap sin romper nada. | `parted` `pvcreate` `vgcreate -s` `lvcreate -L/-l` `blkid` `mkswap` `/etc/fstab` |
| 6 | Sistemas de archivos | Formatear (XFS, ext4, VFAT), montar NFS, automontar con autofs, agrandar LVs y arreglar permisos. | `mkfs.xfs` `mount -t nfs` `autofs` `lvextend -r` `chmod g+s` `setfacl` |
| 7 | Desplegar y mantener | Programar tareas, habilitar servicios, elegir el target por defecto, sincronizar la hora y tocar GRUB. | `crontab -e -u` `at` `*.timer` `systemctl enable --now` `set-default` `chronyc` `grubby` |
| 8 | Redes | IP fija IPv4/IPv6, hostname, DNS y abrir puertos en el firewall. | `nmcli con mod` `hostnamectl` `firewall-cmd --permanent` |
| 9 | Usuarios y grupos | Crear y modificar usuarios y grupos, caducidad de contraseñas y dar permisos de sudo. | `useradd -u -G -s` `usermod -aG` `chage` `groupadd` `visudo` |
| 10 | Seguridad | Firewall, umask, SSH por clave y SELinux (modos, contextos, puertos y booleanos). | `ssh-keygen` `ssh-copy-id` `setenforce` `semanage fcontext/port` `restorecon` `setsebool -P` |

## Las 6 reglas de oro

1. **Persistencia:** `--permanent`, `setsebool -P`, `systemctl enable`, fstab.
2. **Nunca desactives SELinux:** arregla contextos y puertos con `semanage` y `restorecon`.
3. **fstab con cuidado:** `findmnt --verify` y `mount -a` antes de reiniciar.
4. **Red y root primero:** sin ellos no puedes avanzar.
5. **Usa `man`:** `man 5 crontab`, `man semanage-fcontext` y `man nmcli-examples` traen ejemplos.
6. **Reinicia al final** y verifica cada tarea.

## Fuera del examen RHEL 10

Aparecen en el curso, pero **ya no son objetivos del EX200**: Stratis, VDO, Podman/contenedores, Samba y FTP.
