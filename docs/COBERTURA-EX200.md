# Cobertura de los objetivos oficiales del EX200 (RHEL 10)

> Generado desde `data/objetivos.json` con `npm run cobertura:md`. Fuente de los objetivos: [redhat.com · EX200](https://www.redhat.com/en/services/training/ex200-red-hat-certified-system-administrator-rhcsa-exam), revisada el 29/09/2026.

**62 objetivos oficiales**, todos con explicación en su tema y al menos un ejercicio. En el sitio están en `/objetivos`, como checklist para el estudiante.

## Herramientas esenciales

Tema: `content/temas/01-herramientas-esenciales.md`

| Objetivo oficial | En palabras simples | Ejercicios |
|---|---|---|
| Access a shell prompt and issue commands with correct syntax | Abrir la terminal y escribir comandos con sus opciones y argumentos en el orden correcto. | `herr-01`, `herr-10` |
| Use input-output redirection (>, >>, \|, 2>, etc.) | Guardar la salida en archivos (>, >>), separar los errores (2>) y encadenar comandos con \|. | `herr-08`, `herr-14` (quiz) |
| Use grep and regular expressions to analyze text | Buscar líneas que cumplan un patrón (^inicio, fin$, [0-9]...) y guardar el resultado. | `herr-02`, `herr-09` |
| Access remote systems using SSH | Conectarte a otra máquina con ssh usuario@host y ejecutar comandos allí. | `herr-07` |
| Log in and switch users in multi-user targets | Iniciar sesión en modo texto y cambiar de usuario con su / su - o usar sudo. | `herr-07`, `herr-08`, `herr-11` (quiz) |
| Archive, compress, unpack, and uncompress files using tar, gzip, and bzip2 | Crear y extraer archivos .tar.gz y .tar.bz2 (tar -czf / -cjf / -xf) y usar gzip/bzip2 sueltos. | `herr-03`, `herr-04` |
| Create and edit text files | Crear y modificar archivos con vim (o nano), guardar y salir sin perder cambios. | `herr-05`, `herr-10` |
| Create, delete, copy, and move files and directories | Manejar archivos y carpetas con mkdir, cp, mv, rm y sus opciones -r / -p. | `herr-01`, `herr-10` |
| Create hard and soft links | Crear enlaces duros (ln) y simbólicos (ln -s) y entender la diferencia. | `herr-05` |
| List, set, and change standard ugo/rwx permissions | Leer permisos con ls -l y cambiarlos con chmod (simbólico u octal) y chown/chgrp. | `herr-06` |
| Locate, read, and use system documentation including man, info, and files in /usr/share/doc | Encontrar ayuda sin internet: man -k, secciones del manual, info y /usr/share/doc. | `herr-12` (quiz), `herr-13` |

## Gestionar software

Tema: `content/temas/02-software.md`

| Objetivo oficial | En palabras simples | Ejercicios |
|---|---|---|
| Configure access to RPM repositories | Crear archivos .repo en /etc/yum.repos.d para que dnf sepa de dónde descargar paquetes. | `soft-01`, `soft-02` (quiz), `soft-07` (quiz) |
| Install and remove RPM software packages | Instalar, quitar y consultar paquetes con dnf y rpm. | `soft-03`, `soft-04` |
| Configure access to Flatpak repositories | Agregar un remoto de Flatpak con flatpak remote-add. | `soft-05` |
| Install and remove Flatpak software packages | Instalar, listar y desinstalar aplicaciones Flatpak. | `soft-06` |

## Scripts de shell

Tema: `content/temas/03-scripts.md`

| Objetivo oficial | En palabras simples | Ejercicios |
|---|---|---|
| Conditionally execute code (use of: if, test, [], etc.) | Hacer que el script decida con if/elif/else, test y [ ]. | `scr-01`, `scr-02`, `scr-03`, `scr-05`, `scr-08` (quiz) |
| Use Looping constructs (for, etc.) to process file, command line input | Repetir acciones con for o while sobre archivos, líneas o argumentos. | `scr-02`, `scr-03`, `scr-05` |
| Process script inputs ($1, $2, etc.) | Leer argumentos del script ($1, $2, $#, $@) y validar que existan. | `scr-01`, `scr-02`, `scr-04`, `scr-05`, `scr-07` (quiz) |
| Processing output of shell commands within a script | Usar la salida de un comando dentro del script con $(comando). | `scr-04`, `scr-05`, `scr-06` |

## Operar sistemas en ejecución

Tema: `content/temas/04-sistemas-en-ejecucion.md`

| Objetivo oficial | En palabras simples | Ejercicios |
|---|---|---|
| Boot, reboot, and shut down a system normally | Reiniciar y apagar correctamente con systemctl reboot / poweroff. | `oper-01`, `oper-03` (quiz) |
| Boot systems into different targets manually | Cambiar de target en caliente (systemctl isolate) o desde GRUB (systemd.unit=). | `oper-01`, `oper-02` |
| Interrupt the boot process in order to gain access to a system | Entrar al sistema sin conocer la contraseña de root interrumpiendo el arranque desde GRUB. | `oper-04`, `oper-05` (quiz) |
| Identify CPU/memory intensive processes and kill processes | Encontrar con top/ps los procesos que más consumen y terminarlos con kill/pkill. | `oper-06` |
| Adjust process scheduling | Cambiar la prioridad de los procesos con nice y renice. | `oper-07`, `oper-08` (quiz) |
| Manage tuning profiles | Ver, recomendar y aplicar perfiles de rendimiento con tuned-adm. | `oper-09` |
| Locate and interpret system log files and journals | Leer /var/log y filtrar el journal con journalctl (-u, -p, --since, -b). | `oper-11`, `oper-12` (quiz) |
| Preserve system journals | Hacer que el journal se guarde en disco y sobreviva a los reinicios. | `oper-10` |
| Start, stop, and check the status of network services | Arrancar, detener y revisar servicios como sshd con systemctl. | `oper-13` |
| Securely transfer files between systems | Copiar archivos entre máquinas con scp, sftp o rsync sobre SSH. | `oper-14` |

## Almacenamiento local

Tema: `content/temas/05-almacenamiento-local.md`

| Objetivo oficial | En palabras simples | Ejercicios |
|---|---|---|
| List, create, and delete partitions on GPT disks | Ver, crear y borrar particiones en discos GPT con parted o fdisk. | `alm-01`, `alm-05`, `alm-08`, `alm-13` (quiz) |
| Create and remove physical volumes | Preparar discos o particiones para LVM con pvcreate y quitarlos con pvremove. | `alm-02`, `alm-08`, `alm-09` |
| Assign physical volumes to volume groups | Crear un grupo de volúmenes (vgcreate) o ampliarlo (vgextend) con PVs. | `alm-02`, `alm-04` (quiz), `alm-08` |
| Create and delete logical volumes | Crear volúmenes lógicos por tamaño (-L) o extents (-l) y borrarlos con lvremove. | `alm-02`, `alm-10`, `alm-11` (quiz) |
| Configure systems to mount file systems at boot by universally unique ID (UUID) or label | Agregar entradas a /etc/fstab usando UUID= o LABEL= para montar al arrancar. | `alm-02`, `alm-06` |
| Add new partitions and logical volumes, and swap to a system non-destructively | Agregar almacenamiento y swap nuevos sin tocar los datos que ya existen. | `alm-03`, `alm-07`, `alm-08`, `alm-12` (quiz) |

## Sistemas de archivos

Tema: `content/temas/06-sistemas-de-archivos.md`

| Objetivo oficial | En palabras simples | Ejercicios |
|---|---|---|
| Create, mount, unmount, and use VFAT, ext4, and XFS file systems | Formatear con mkfs.vfat / mkfs.ext4 / mkfs.xfs, montar y desmontar. | `fs-01`, `fs-02`, `fs-06` |
| Mount and unmount network file systems using NFS | Montar carpetas compartidas por NFS a mano y de forma persistente en fstab. | `fs-03` |
| Configure autofs | Hacer que las carpetas NFS se monten solas al entrar en ellas (auto.master.d + mapas). | `fs-04`, `fs-05` |
| Extend existing logical volumes | Agrandar un LV y su sistema de archivos sin perder datos (lvextend -r). | `fs-06`, `fs-07` (quiz) |
| Diagnose and correct file permission problems | Resolver por qué alguien no puede leer o escribir: permisos, SGID, sticky bit y ACL. | `fs-08`, `fs-09`, `fs-10` (quiz), `fs-11` (quiz) |

## Desplegar y mantener

Tema: `content/temas/07-despliegue-mantenimiento.md`

| Objetivo oficial | En palabras simples | Ejercicios |
|---|---|---|
| Schedule tasks using at, cron and systemd timer units | Programar tareas únicas (at), repetitivas (cron) y con timers de systemd. | `desp-01`, `desp-02` (quiz), `desp-03`, `desp-04`, `desp-05` (quiz) |
| Start and stop services and configure services to start automatically at boot | Controlar servicios con systemctl start/stop y habilitarlos al arranque con enable. | `desp-06`, `desp-07` (quiz) |
| Configure systems to boot into a specific target automatically | Elegir el target por defecto con systemctl set-default. | `desp-08` |
| Configure time service clients | Sincronizar la hora con un servidor NTP usando chrony. | `desp-09` |
| Install and update software packages from Red Hat Content Delivery Network, a remote repository, or from the local file system | Instalar y actualizar con dnf desde los repos de Red Hat, un repo remoto o un .rpm local. | `desp-10`, `desp-11` |
| Modify the system bootloader | Cambiar parámetros del kernel o el kernel por defecto con grubby (y GRUB con grub2-mkconfig). | `desp-12`, `desp-13` (quiz) |

## Redes básicas

Tema: `content/temas/08-redes.md`

| Objetivo oficial | En palabras simples | Ejercicios |
|---|---|---|
| Configure IPv4 and IPv6 addresses | Poner IP fija IPv4 e IPv6, gateway y DNS con nmcli. | `red-01`, `red-02`, `red-03` |
| Configure hostname resolution | Configurar el nombre de la máquina (hostnamectl), /etc/hosts y los servidores DNS. | `red-01`, `red-04`, `red-05` (quiz), `red-06` (quiz) |
| Configure network services to start automatically at boot | Hacer que la conexión de red y los servicios de red arranquen solos (autoconnect, enable). | `red-09` |
| Restrict network access using firewalld and firewall-cmd | Permitir solo los servicios y puertos necesarios con firewall-cmd --permanent. | `red-07`, `red-08` (quiz) |

## Usuarios y grupos

Tema: `content/temas/09-usuarios-grupos.md`

| Objetivo oficial | En palabras simples | Ejercicios |
|---|---|---|
| Create, delete, and modify local user accounts | Crear, modificar y borrar usuarios con useradd, usermod y userdel. | `usr-01`, `usr-02`, `usr-06`, `usr-10` (quiz) |
| Change passwords and adjust password aging for local user accounts | Cambiar contraseñas (passwd) y su caducidad (chage, /etc/login.defs). | `usr-03`, `usr-04`, `usr-09` (quiz) |
| Create, delete, and modify local groups and group memberships | Crear grupos (groupadd) y agregar o quitar miembros (usermod -aG, gpasswd). | `usr-01`, `usr-07`, `usr-08` (quiz) |
| Configure privileged access | Dar permisos de administrador con sudo: grupo wheel o archivos en /etc/sudoers.d. | `usr-05`, `usr-06` |

## Seguridad

Tema: `content/temas/10-seguridad.md`

| Objetivo oficial | En palabras simples | Ejercicios |
|---|---|---|
| Configure firewall settings using firewall-cmd/firewalld | Configurar zonas, servicios y puertos de firewalld de forma persistente. | `seg-12` |
| Manage default file permissions | Controlar los permisos con que nacen los archivos nuevos usando umask. | `seg-09` |
| Configure key-based authentication for SSH | Entrar por SSH sin contraseña con ssh-keygen + ssh-copy-id. | `seg-10`, `seg-11` |
| Set enforcing and permissive modes for SELinux | Cambiar el modo de SELinux (setenforce) y hacerlo persistente en /etc/selinux/config. | `seg-04`, `seg-05` (quiz) |
| List and identify SELinux file and process context | Ver etiquetas SELinux de archivos (ls -Z) y procesos (ps -eZ). | `seg-02`, `seg-08` (quiz) |
| Restore default file contexts | Devolver a los archivos su etiqueta correcta con restorecon (y semanage fcontext). | `seg-01`, `seg-02`, `seg-03` (quiz) |
| Manage SELinux port labels | Permitir que un servicio use un puerto no estándar con semanage port. | `seg-01` |
| Use Boolean settings to modify system SELinux settings | Activar o desactivar comportamientos de SELinux con setsebool -P. | `seg-06`, `seg-07` (quiz) |
