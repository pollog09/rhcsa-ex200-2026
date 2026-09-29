---
slug: despliegue-mantenimiento
orden: 7
titulo: "Despliegue y mantenimiento"
resumen: "Aprenderás a programar tareas, controlar servicios al arranque, sincronizar la hora y ajustar el cargador de arranque."
dias: [4, 7, 10]
---

## En palabras simples

Programar tareas es como poner alarmas: `cron` repite, `at` avisa una sola vez y los timers de systemd son alarmas más completas.
Habilitar un servicio es dejarlo en la lista de "abrir el local cada mañana".
chrony es el reloj de pared que se sincroniza solo con una hora oficial por red.
GRUB es el portero del arranque: decide con qué kernel y con qué opciones empieza el sistema.

## Comandos clave

### cron

```bash
crontab -e                      # edita las tareas del usuario actual
crontab -e -u ana               # edita las de ana (como root)
crontab -l -u ana               # lista
# min hora día-mes mes día-semana  comando
# 30 14 * * 1-5  /usr/local/bin/backup.sh     (lunes a viernes a las 14:30)
# */5 * * * *    logger "cada 5 minutos"
# 0 2 1 * *      /root/limpia.sh              (día 1 de cada mes a las 2:00)
```

### at

```bash
systemctl enable --now atd
echo "touch /tmp/hecho" | at now + 5 minutes   # una sola vez
at 23:00 tomorrow               # interactivo; termina con Ctrl+D
atq                             # tareas pendientes
atrm 3                          # borra la tarea 3
```

### Timers de systemd

```bash
vim /etc/systemd/system/limpieza.service
# [Unit]
# Description=Limpieza de /tmp
# [Service]
# Type=oneshot
# ExecStart=/usr/local/bin/limpieza.sh

vim /etc/systemd/system/limpieza.timer
# [Unit]
# Description=Limpieza diaria
# [Timer]
# OnCalendar=*-*-* 03:00:00
# Persistent=true
# [Install]
# WantedBy=timers.target

systemctl daemon-reload
systemctl enable --now limpieza.timer
systemctl list-timers
```

### Servicios y target por defecto

```bash
systemctl enable --now httpd        # arranca ahora y en cada inicio
systemctl disable --now cups        # lo contrario
systemctl is-enabled httpd
systemctl mask telnet.socket        # impide que se inicie
systemctl set-default multi-user.target   # arranque en modo texto (persistente)
systemctl get-default               # set-default cambia el enlace /etc/systemd/system/default.target
```

### chrony como cliente NTP

```bash
dnf install -y chrony
vim /etc/chrony.conf
# server classroom.ejemplo.com iburst
systemctl enable --now chronyd ; systemctl restart chronyd
chronyc sources -v                  # '^*' indica el servidor en uso
timedatectl                         # "System clock synchronized: yes"
timedatectl set-timezone America/Santiago
timedatectl set-ntp true            # activa la sincronización NTP (usa chronyd)
```

### Instalar desde CDN, repo remoto o archivo local

```bash
subscription-manager register       # CDN de Red Hat (pide usuario y clave)
dnf repolist                        # repos del CDN o del .repo remoto
dnf install -y ./herramienta.rpm    # archivo local
```

### Bootloader

```bash
grubby --default-kernel                          # kernel por defecto
grubby --info=ALL | grep -E '^(index|kernel)'    # kernels disponibles
grubby --set-default /boot/vmlinuz-<versión>
grubby --update-kernel=ALL --args="quiet"        # agrega opción a todos
grubby --update-kernel=ALL --remove-args="rhgb"  # quita una opción
# grubby edita las entradas BLS de /boot/loader/entries/: no hace falta regenerar nada
vim /etc/default/grub                            # p. ej. GRUB_TIMEOUT=10
grub2-mkconfig -o /boot/grub2/grub.cfg           # regenera tras editar (misma ruta en BIOS y UEFI)
grub2-mkconfig -o /boot/grub2/grub.cfg --update-bls-cmdline   # si cambiaste GRUB_CMDLINE_LINUX
```

En RHEL 10 usa `grubby` para opciones del kernel. `/etc/default/grub` sirve para ajustes de GRUB como `GRUB_TIMEOUT`; si cambias `GRUB_CMDLINE_LINUX`, sin `--update-bls-cmdline` las entradas BLS no cambian.

## Así lo piden en el examen

- "El usuario `natasha` debe ejecutar `logger "Examen"` cada 2 minutos": `crontab -e -u natasha` con `*/2 * * * *`.
- "Sincroniza la hora con `classroom.ejemplo.com`": línea `server` en `/etc/chrony.conf`, reinicia y revisa `chronyc sources`.
- "El sistema debe arrancar en modo texto por defecto": `systemctl set-default multi-user.target`.
- "Agrega el parámetro X a todos los kernels": `grubby --update-kernel=ALL --args=...`.

## Errores típicos

- Olvidar `systemctl daemon-reload` tras crear o editar una unidad.
- Habilitar el `.service` en lugar del `.timer`.
- Iniciar un servicio sin `enable`: tras el reinicio queda apagado.
- Dejar las líneas `pool` antiguas en chrony junto a la nueva, o no reiniciar `chronyd`.
- Editar `/etc/default/grub` sin regenerar con `grub2-mkconfig`, o usar `/boot/efi/EFI/redhat/grub.cfg` (en RHEL 10 ese archivo solo apunta al de `/boot/grub2/`).

## Chequeo rápido

- `systemctl list-timers` y `crontab -l -u natasha` muestran lo programado.
- `chronyc sources` debe marcar `^*` en el servidor pedido.
- Reinicia y revisa `systemctl get-default` y `systemctl is-enabled <servicio>`.
