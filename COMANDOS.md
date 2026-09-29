# Chuleta de comandos RHCSA EX200 (RHEL 10)

> Archivo generado desde `data/comandos.json` con `npm run comandos:md`. También disponible con buscador en `/comandos` del sitio.

- [Herramientas esenciales](#herramientas-esenciales)
- [Gestionar software](#software)
- [Scripts de shell](#scripts)
- [Operar sistemas en ejecución](#sistemas-en-ejecucion)
- [Almacenamiento local](#almacenamiento-local)
- [Sistemas de archivos](#sistemas-de-archivos)
- [Desplegar y mantener](#despliegue-mantenimiento)
- [Redes básicas](#redes)
- [Usuarios y grupos](#usuarios-grupos)
- [Seguridad](#seguridad)

<a id="herramientas-esenciales"></a>

## Herramientas esenciales

| Comando | Para qué sirve | Ejemplo |
|---|---|---|
| `ls` | Lista archivos y carpetas | `ls -lah /etc` |
| `cd` | Cambia de directorio | `cd /var/log` |
| `pwd` | Muestra la carpeta actual | `pwd` |
| `mkdir` | Crea carpetas | `mkdir -p /datos/2026/enero` |
| `touch` | Crea un archivo vacío o actualiza su fecha | `touch /tmp/nota.txt` |
| `cp` | Copia archivos o carpetas | `cp -a /etc/skel /tmp/copia` |
| `mv` | Mueve o renombra archivos | `mv nota.txt /tmp/nota-vieja.txt` |
| `rm` | Borra archivos o carpetas | `rm -r /tmp/copia` |
| `ln` | Crea un enlace duro | `ln /datos/a.txt /datos/a_duro.txt` |
| `ln -s` | Crea un enlace simbólico | `ln -s /etc/hosts /root/hosts_link` |
| `cat` | Muestra el contenido de un archivo | `cat /etc/os-release` |
| `less` | Muestra un archivo página por página | `less /var/log/messages` |
| `grep` | Busca líneas que coinciden con un patrón | `grep -E "^(root\|ana):" /etc/passwd` |
| `find` | Busca archivos por nombre, dueño, tamaño o permisos | `find / -user harry -type f 2>/dev/null` |
| `wc` | Cuenta líneas, palabras o bytes | `wc -l /etc/passwd` |
| `head` | Muestra las primeras líneas | `head -n 5 /etc/passwd` |
| `tail` | Muestra las últimas líneas o sigue un archivo | `tail -f /var/log/secure` |
| `tar` | Empaqueta y comprime (-z gzip, -j bzip2) o extrae (-x) | `tar -czf /root/etc.tar.gz /etc` |
| `gzip` | Comprime un archivo con gzip | `gzip /tmp/informe.txt` |
| `bzip2` | Comprime un archivo con bzip2 | `bzip2 /tmp/informe.txt` |
| `chmod` | Cambia los permisos de un archivo | `chmod 750 script.sh` |
| `chown` | Cambia el dueño y el grupo | `chown ana:ventas informe.txt` |
| `su` | Cambia a otro usuario | `su - ana` |
| `ssh` | Abre una sesión remota segura | `ssh ana@servidor1` |
| `vim` | Edita archivos de texto | `vim /etc/hosts` |
| `man` | Abre el manual de un comando | `man -k partition` |
| `tar -x` | Extrae un archivo tar en otra carpeta | `tar -xjf /root/etc.tar.bz2 -C /tmp/restaurado` |
| `gunzip / bunzip2` | Descomprime archivos .gz o .bz2 | `bunzip2 /tmp/informe.txt.bz2` |
| `mandb` | Regenera el índice que usa man -k | `mandb && man -k password` |
| `info` | Abre la documentación en formato info | `info coreutils` |

<a id="software"></a>

## Gestionar software

| Comando | Para qué sirve | Ejemplo |
|---|---|---|
| `dnf install` | Instala paquetes con sus dependencias | `dnf install -y httpd` |
| `dnf remove` | Desinstala paquetes | `dnf remove -y vsftpd` |
| `dnf search` | Busca paquetes por nombre o descripción | `dnf search nfs` |
| `dnf info` | Muestra detalles de un paquete | `dnf info httpd` |
| `dnf provides` | Indica qué paquete trae un archivo | `dnf provides "*/semanage"` |
| `dnf repolist` | Lista los repositorios habilitados | `dnf repolist -v` |
| `dnf history` | Muestra y deshace transacciones | `dnf history undo 5` |
| `dnf config-manager` | Agrega, habilita o deshabilita repositorios (dnf 4 en RHEL 10) | `dnf config-manager --add-repo http://repo.ejemplo.com/BaseOS` |
| `dnf clean` | Limpia la caché de repositorios | `dnf clean all` |
| `rpm -qa` | Lista los paquetes instalados | `rpm -qa \| grep httpd` |
| `rpm -qi` | Muestra información de un paquete instalado | `rpm -qi openssh-server` |
| `rpm -ql` | Lista los archivos de un paquete | `rpm -ql httpd` |
| `rpm -qf` | Indica a qué paquete pertenece un archivo | `rpm -qf /etc/ssh/sshd_config` |
| `flatpak remote-add` | Agrega un repositorio Flatpak (rhel es el remoto oficial de Red Hat) | `flatpak remote-add --if-not-exists rhel https://flatpaks.redhat.io/rhel.flatpakrepo` |
| `flatpak remotes` | Lista los repositorios Flatpak | `flatpak remotes` |
| `flatpak install` | Instala una aplicación Flatpak | `flatpak install -y rhel org.gnome.Calculator` |
| `flatpak list` | Lista las aplicaciones Flatpak instaladas | `flatpak list --app` |
| `flatpak uninstall` | Desinstala una aplicación Flatpak | `flatpak uninstall -y org.gnome.Calculator` |
| `flatpak remote-ls` | Lista las aplicaciones de un remoto Flatpak | `flatpak remote-ls --app rhel` |

<a id="scripts"></a>

## Scripts de shell

| Comando | Para qué sirve | Ejemplo |
|---|---|---|
| `#!/bin/bash` | Indica el intérprete del script | `#!/bin/bash` |
| `bash -x` | Ejecuta un script mostrando cada paso | `bash -x /usr/local/bin/backup.sh` |
| `bash -n` | Revisa la sintaxis sin ejecutar | `bash -n /usr/local/bin/backup.sh` |
| `$1 $2` | Leen los argumentos del script | `echo "Usuario: $1, grupo: $2"` |
| `$#` | Cuenta los argumentos recibidos | `if [ $# -ne 1 ]; then exit 1; fi` |
| `$?` | Guarda el código de salida del último comando | `grep ana /etc/passwd; echo $?` |
| `if` | Ejecuta código según una condición | `if [ -f /etc/hosts ]; then echo existe; fi` |
| `test` | Evalúa una condición sobre archivos, texto o números | `test -d /datos && echo carpeta` |
| `[ ]` | Forma corta de test | `[ "$1" = "ana" ] && echo hola` |
| `for` | Repite una acción para cada elemento | `for u in ana luis; do useradd "$u"; done` |
| `while read` | Recorre un archivo línea a línea | `while read u; do useradd "$u"; done < /root/lista.txt` |
| `$( )` | Guarda la salida de un comando en una variable | `hoy=$(date +%F)` |
| `exit` | Termina el script con un código de salida | `exit 1` |
| `echo` | Imprime texto o variables | `echo "Uso: $0 <usuario>" >&2` |
| `awk` | Extrae columnas de un texto | `awk -F: '$3>=1000 {print $1}' /etc/passwd` |
| `cut` | Corta campos de cada línea | `cut -d: -f1 /etc/passwd` |
| `logger` | Escribe un mensaje en el journal | `logger -t backup "Respaldo terminado"` |

<a id="sistemas-en-ejecucion"></a>

## Operar sistemas en ejecución

| Comando | Para qué sirve | Ejemplo |
|---|---|---|
| `systemctl reboot` | Reinicia el sistema | `systemctl reboot` |
| `systemctl poweroff` | Apaga el sistema | `systemctl poweroff` |
| `systemctl isolate` | Cambia al target indicado ahora | `systemctl isolate multi-user.target` |
| `systemd.unit=` | Arranca una vez en otro target desde GRUB | `systemd.unit=rescue.target` |
| `rd.break` | Detiene el arranque en el initramfs para resetear root | `linux ... rd.break` |
| `mount -o remount,rw` | Remonta el disco real en modo escritura | `mount -o remount,rw /sysroot` |
| `chroot` | Entra al sistema instalado desde el initramfs | `chroot /sysroot` |
| `touch /.autorelabel` | Pide reetiquetar SELinux en el próximo arranque | `touch /.autorelabel` |
| `top` | Muestra procesos y consumo en vivo | `top` |
| `ps` | Lista procesos con su consumo | `ps aux --sort=-%cpu \| head` |
| `kill` | Envía una señal a un proceso | `kill -9 1234` |
| `pkill` | Termina procesos por nombre o usuario | `pkill -u ana` |
| `nice` | Arranca un proceso con otra prioridad | `nice -n 10 tar -czf /tmp/b.tgz /usr` |
| `renice` | Fija el nice de un proceso en marcha (bajarlo requiere root) | `renice -n 5 -p 1234` |
| `tuned-adm` | Aplica perfiles de rendimiento | `tuned-adm profile virtual-guest` |
| `journalctl` | Consulta los logs del journal | `journalctl -u sshd -p err -b` |
| `Storage=persistent` | Guarda el journal en /var/log/journal (por defecto va a /run y se pierde) | `printf "[Journal]\nStorage=persistent\n" > /etc/systemd/journald.conf.d/persist.conf` |
| `scp` | Copia archivos por SSH | `scp /root/a.txt ana@srv2:/tmp/` |
| `sftp` | Transfiere archivos en sesión interactiva por SSH | `sftp ana@srv2` |
| `rsync` | Sincroniza archivos de forma incremental | `rsync -avz /datos/ ana@srv2:/respaldo/` |
| `journalctl --list-boots` | Lista los arranques guardados en el journal | `journalctl --list-boots` |

<a id="almacenamiento-local"></a>

## Almacenamiento local

| Comando | Para qué sirve | Ejemplo |
|---|---|---|
| `lsblk` | Muestra discos, particiones y montajes | `lsblk -f` |
| `blkid` | Muestra UUID, LABEL y tipo de cada dispositivo | `blkid /dev/vdb1` |
| `parted` | Crea y muestra particiones | `parted /dev/vdb mkpart datos xfs 1MiB 1GiB` |
| `parted mklabel` | Crea una tabla de particiones GPT | `parted /dev/vdb mklabel gpt` |
| `fdisk` | Particiona un disco de forma interactiva | `fdisk /dev/vdb` |
| `parted rm` | Borra una partición por su número (gdisk no viene en RHEL 10) | `parted /dev/vdb rm 3` |
| `udevadm settle` | Espera a que el sistema detecte las particiones nuevas | `udevadm settle` |
| `pvcreate` | Crea un volumen físico LVM | `pvcreate /dev/vdb2` |
| `vgcreate` | Crea un grupo de volúmenes | `vgcreate -s 16M vgdatos /dev/vdb2` |
| `lvcreate` | Crea un volumen lógico | `lvcreate -n lvdatos -L 500M vgdatos` |
| `pvs / vgs / lvs` | Resumen de cada capa de LVM | `lvs` |
| `vgdisplay` | Muestra el detalle de un VG | `vgdisplay vgdatos` |
| `lvremove` | Borra un volumen lógico | `lvremove -y /dev/vgdatos/lvdatos` |
| `vgremove` | Borra un grupo de volúmenes | `vgremove vgdatos` |
| `vgreduce` | Saca un PV vacío de un grupo de volúmenes | `pvmove /dev/vdb1 && vgreduce vgdatos /dev/vdb1` |
| `pvremove` | Quita la marca LVM de un dispositivo | `pvremove /dev/vdb2` |
| `mkswap` | Prepara un dispositivo como swap | `mkswap /dev/vdb3` |
| `swapon` | Activa la swap | `swapon -a && swapon --show` |
| `mount -a` | Monta todo lo que está en fstab | `mount -a` |
| `xfs_admin -L / e2label` | Pone una etiqueta (LABEL) a un XFS desmontado o a un ext4 | `xfs_admin -L BACKUP /dev/vdb1 ; e2label /dev/vdb2 datos` |
| `findmnt` | Muestra montajes y valida fstab | `findmnt --verify` |
| `systemctl daemon-reload` | Hace que systemd relea fstab y unidades | `systemctl daemon-reload` |

<a id="sistemas-de-archivos"></a>

## Sistemas de archivos

| Comando | Para qué sirve | Ejemplo |
|---|---|---|
| `mkfs.xfs` | Crea un sistema de archivos XFS (mínimo ~300 MiB) | `mkfs.xfs /dev/vdb1` |
| `mkfs.ext4` | Crea un sistema de archivos ext4 | `mkfs.ext4 -L backup /dev/vdb2` |
| `mkfs.vfat` | Crea un VFAT con etiqueta (paquete dosfstools) | `mkfs.vfat -n USB /dev/vdb3` |
| `mount` | Monta un sistema de archivos | `mount /dev/vdb1 /mnt/xfs` |
| `umount` | Desmonta un sistema de archivos | `umount /mnt/xfs` |
| `df` | Muestra espacio usado y tipo de cada montaje | `df -hT` |
| `lvextend -r` | Amplía un LV y su sistema de archivos | `lvextend -r -L +300M /dev/vgdatos/lvdatos` |
| `vgextend` | Agrega un PV a un grupo de volúmenes | `vgextend vgdatos /dev/vdc1` |
| `xfs_growfs` | Amplía un XFS montado | `xfs_growfs /datos` |
| `resize2fs` | Amplía un ext4 | `resize2fs /dev/vgdatos/lvapp` |
| `showmount` | Lista lo que exporta un servidor NFS | `showmount -e servidor.ejemplo.com` |
| `mount -t nfs` | Monta una carpeta NFS | `mount -t nfs servidor.ejemplo.com:/export /mnt/nfs` |
| `auto.master.d` | Define un punto de montaje de autofs | `echo "/remoto /etc/auto.remoto" > /etc/auto.master.d/remoto.autofs` |
| `autofs` | Monta carpetas al usarlas | `systemctl enable --now autofs` |
| `chmod g+s` | Activa SGID para heredar el grupo | `chmod 2770 /srv/ventas` |
| `chmod o+t` | Activa el sticky bit en una carpeta | `chmod 1777 /srv/comun` |
| `umask` | Define los permisos de lo que se crea | `umask 027` |
| `setfacl` | Agrega permisos ACL a usuarios o grupos | `setfacl -m u:natasha:rw /var/tmp/fstab` |
| `getfacl` | Muestra las ACL de un archivo | `getfacl /var/tmp/fstab` |

<a id="despliegue-mantenimiento"></a>

## Desplegar y mantener

| Comando | Para qué sirve | Ejemplo |
|---|---|---|
| `crontab` | Programa tareas repetitivas | `crontab -e -u natasha` |
| `at` | Programa una tarea una sola vez | `echo "touch /tmp/hecho" \| at now + 5 minutes` |
| `atq` | Lista las tareas de at pendientes | `atq` |
| `atrm` | Borra una tarea de at | `atrm 3` |
| `systemctl list-timers` | Lista los timers de systemd | `systemctl list-timers` |
| `OnCalendar` | Define cuándo se dispara un timer | `OnCalendar=*-*-* 03:00:00` |
| `systemctl enable --now` | Habilita e inicia un servicio o timer | `systemctl enable --now limpieza.timer` |
| `systemctl disable` | Quita un servicio del arranque | `systemctl disable --now cups` |
| `systemctl is-enabled` | Indica si un servicio arranca solo | `systemctl is-enabled httpd` |
| `systemctl mask` | Impide que un servicio se inicie | `systemctl mask telnet.socket` |
| `systemctl set-default` | Cambia el target por defecto | `systemctl set-default multi-user.target` |
| `systemctl get-default` | Muestra el target por defecto | `systemctl get-default` |
| `chronyc sources` | Muestra los servidores de hora | `chronyc sources -v` |
| `timedatectl` | Muestra y ajusta hora y zona horaria | `timedatectl set-timezone America/Santiago` |
| `subscription-manager` | Registra el sistema en el CDN de Red Hat | `subscription-manager register` |
| `dnf install ./` | Instala un RPM desde un archivo local | `dnf install -y ./herramienta.rpm` |
| `grubby` | Cambia las opciones del kernel en las entradas BLS (persistente) | `grubby --update-kernel=ALL --args="quiet"` |
| `grubby --default-kernel` | Muestra el kernel por defecto | `grubby --default-kernel` |
| `grub2-mkconfig` | Regenera grub.cfg (misma ruta en BIOS y UEFI); con --update-bls-cmdline aplica GRUB_CMDLINE_LINUX | `grub2-mkconfig -o /boot/grub2/grub.cfg --update-bls-cmdline` |
| `timedatectl set-ntp` | Activa o desactiva la sincronización NTP | `timedatectl set-ntp true` |

<a id="redes"></a>

## Redes básicas

| Comando | Para qué sirve | Ejemplo |
|---|---|---|
| `ip addr` | Muestra las direcciones IP | `ip -br addr` |
| `ip route` | Muestra las rutas y el gateway | `ip route` |
| `nmcli device status` | Muestra interfaces y su perfil | `nmcli device status` |
| `nmcli connection show` | Lista los perfiles de red | `nmcli con show` |
| `nmcli connection add` | Crea un perfil de red | `nmcli con add con-name estatica ifname enp1s0 type ethernet ipv4.method manual ipv4.addresses 192.168.10.20/24` |
| `nmcli connection modify` | Modifica un perfil de red | `nmcli con mod estatica ipv4.gateway 192.168.10.1 ipv4.dns 192.168.10.1` |
| `ipv6.addresses` | Asigna una IPv6 fija a un perfil | `nmcli con mod estatica ipv6.method manual ipv6.addresses 2001:db8::20/64` |
| `nmcli connection up` | Activa un perfil y aplica sus cambios | `nmcli con up estatica` |
| `connection.autoconnect` | Activa el perfil al arrancar | `nmcli con mod estatica connection.autoconnect yes` |
| `hostnamectl` | Muestra o cambia el nombre del equipo | `hostnamectl set-hostname servidor1.ejemplo.com` |
| `/etc/hosts` | Resuelve nombres de forma local | `echo "192.168.10.30 srv2" >> /etc/hosts` |
| `getent hosts` | Resuelve un nombre como lo hace el sistema | `getent hosts srv2` |
| `dig` | Consulta un servidor DNS | `dig +short redhat.com` |
| `ping` | Comprueba si un equipo responde | `ping -c3 192.168.10.1` |
| `ss` | Muestra puertos abiertos y conexiones | `ss -tlnp` |
| `firewall-cmd --add-service` | Abre un servicio en el firewall | `firewall-cmd --permanent --add-service=http` |
| `firewall-cmd --add-port` | Abre un puerto en el firewall | `firewall-cmd --permanent --add-port=8080/tcp` |
| `firewall-cmd --reload` | Aplica la configuración permanente | `firewall-cmd --reload` |
| `firewall-cmd --list-all` | Muestra la configuración de la zona | `firewall-cmd --list-all` |
| `/etc/NetworkManager/system-connections/` | Perfiles de red en formato keyfile (ifcfg ya no se admite en RHEL 10) | `ls /etc/NetworkManager/system-connections/` |

<a id="usuarios-grupos"></a>

## Usuarios y grupos

| Comando | Para qué sirve | Ejemplo |
|---|---|---|
| `useradd` | Crea un usuario nuevo | `useradd -u 2000 -G wheel ana` |
| `useradd -s` | Crea un usuario con otra shell | `useradd -s /sbin/nologin sarah` |
| `usermod -aG` | Agrega un usuario a un grupo extra | `usermod -aG ventas ana` |
| `usermod -L` | Bloquea una cuenta | `usermod -L ana` |
| `userdel` | Borra un usuario | `userdel -r luis` |
| `id` | Muestra UID, GID y grupos de un usuario | `id ana` |
| `passwd` | Asigna o cambia una contraseña | `passwd ana` |
| `chpasswd` | Asigna contraseñas sin interacción | `echo "ana:Clave2026" \| chpasswd` |
| `chage -l` | Muestra la caducidad de la contraseña | `chage -l ana` |
| `chage -M` | Fija los días máximos de la contraseña | `chage -M 90 -W 7 ana` |
| `chage -d 0` | Obliga a cambiar la contraseña al entrar | `chage -d 0 ana` |
| `chage -E` | Fija la fecha de vencimiento de la cuenta | `chage -E 2026-12-31 ana` |
| `/etc/login.defs` | Define la política para usuarios nuevos | `PASS_MAX_DAYS 60` |
| `groupadd` | Crea un grupo | `groupadd -g 3000 soporte` |
| `groupmod` | Modifica un grupo | `groupmod -n comercial ventas` |
| `groupdel` | Borra un grupo | `groupdel soporte` |
| `gpasswd -a` | Agrega un miembro a un grupo | `gpasswd -a ana ventas` |
| `gpasswd -d` | Quita un miembro de un grupo | `gpasswd -d ana ventas` |
| `getent group` | Muestra los miembros de un grupo | `getent group ventas` |
| `visudo` | Edita sudoers validando la sintaxis | `visudo -f /etc/sudoers.d/admins` |
| `sudo -l` | Muestra qué puede hacer un usuario con sudo | `sudo -l -U ana` |
| `passwd --stdin` | Asigna una contraseña sin preguntar | `echo "Clave2026" \| passwd --stdin ana` |
| `visudo -c` | Valida la sintaxis de todos los archivos sudoers | `visudo -c` |
| `useradd -D` | Muestra los valores por defecto de useradd | `useradd -D` |

<a id="seguridad"></a>

## Seguridad

| Comando | Para qué sirve | Ejemplo |
|---|---|---|
| `firewall-cmd --get-active-zones` | Muestra las zonas activas | `firewall-cmd --get-active-zones` |
| `firewall-cmd --add-source` | Asigna una red de origen a una zona | `firewall-cmd --permanent --zone=internal --add-source=192.168.56.0/24` |
| `firewall-cmd --remove-service` | Cierra un servicio en el firewall | `firewall-cmd --permanent --remove-service=cockpit` |
| `umask` | Muestra o cambia la máscara de permisos (por defecto 0022, UMASK en /etc/login.defs) | `umask 077` |
| `ssh-keygen` | Crea un par de llaves SSH | `ssh-keygen -t ed25519` |
| `ssh-copy-id` | Copia la llave pública a otro servidor | `ssh-copy-id ana@servidor2` |
| `sshd -t` | Valida la configuración de SSH | `sshd -t && systemctl reload sshd` |
| `getenforce` | Muestra el modo de SELinux | `getenforce` |
| `setenforce` | Cambia el modo de SELinux hasta reiniciar | `setenforce 1` |
| `/etc/selinux/config` | Fija el modo de SELinux de forma permanente | `SELINUX=enforcing` |
| `sestatus` | Muestra el estado completo de SELinux | `sestatus` |
| `ls -Z` | Muestra el contexto de archivos | `ls -Z /var/www/html` |
| `ps -Z` | Muestra el contexto de procesos | `ps -eZ \| grep httpd` |
| `semanage fcontext` | Define el contexto de una ruta de forma persistente | `semanage fcontext -a -t httpd_sys_content_t "/web(/.*)?"` |
| `restorecon` | Aplica el contexto correcto a archivos | `restorecon -Rv /web` |
| `chcon` | Cambia un contexto de forma temporal | `chcon -t httpd_sys_content_t /web/index.html` |
| `semanage port` | Permite un puerto a un tipo de SELinux | `semanage port -a -t http_port_t -p tcp 82` |
| `getsebool` | Muestra el valor de los booleanos | `getsebool -a \| grep httpd` |
| `setsebool -P` | Cambia un booleano de forma persistente | `setsebool -P httpd_enable_homedirs on` |
| `semanage boolean -l` | Lista booleanos con su descripción | `semanage boolean -l \| grep home` |
| `ausearch` | Busca denegaciones en el log de auditoría | `ausearch -m AVC -ts recent` |
| `sealert` | Explica una denegación y sugiere solución | `sealert -a /var/log/audit/audit.log` |
| `/etc/ssh/sshd_config.d/` | Drop-ins de sshd; gana el primer valor leído (PermitRootLogin por defecto: prohibit-password) | `echo "PermitRootLogin no" > /etc/ssh/sshd_config.d/00-examen.conf` |
