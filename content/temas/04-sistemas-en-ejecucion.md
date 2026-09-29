---
slug: sistemas-en-ejecucion
orden: 4
titulo: "Operar sistemas en ejecución"
resumen: "Aprenderás a arrancar y apagar, recuperar root, controlar procesos, leer logs y copiar archivos por red."
dias: [4, 5, 10]
---

## En palabras simples

El servidor es como un restaurante en plena hora punta: hay cocineros (procesos) trabajando y tú eres el encargado.
Puedes ver quién gasta más recursos, bajarle la prioridad o sacarlo de la cocina con `kill`.
El journal es el libro de registro: anota todo lo que pasa, y si lo haces persistente no se borra al cerrar.
Si pierdes la llave del local (la contraseña de root), entras por la puerta de servicio interrumpiendo el arranque.

## Comandos clave

### Arrancar, reiniciar y apagar

```bash
systemctl reboot               # reinicia
systemctl poweroff             # apaga
systemctl get-default          # target con el que arranca
systemctl isolate multi-user.target   # cambia de target ahora
# arrancar una sola vez en otro target: en GRUB pulsa 'e' y agrega
#   systemd.unit=rescue.target   al final de la línea linux, luego Ctrl+X
```

### Resetear la contraseña de root (rd.break)

Es el método documentado por Red Hat: `rd.break`, remontar `/sysroot`, `chroot` y `/.autorelabel`.

```bash
# 1. Reinicia y en el menú de GRUB pulsa 'e' sobre la entrada del kernel
# 2. Ve al final de la línea que empieza con 'linux' y agrega:  rd.break
# 3. Pulsa Ctrl+X para arrancar
mount -o remount,rw /sysroot   # el disco real se monta como lectura/escritura
chroot /sysroot                # entras al sistema instalado
passwd root                    # escribe la nueva contraseña
touch /.autorelabel            # SELinux reetiquetará en el próximo arranque
exit                           # sales del chroot
exit                           # continúa el arranque (reetiqueta y reinicia)
```

Alternativa (no es la documentada): `init=/bin/bash`, luego `mount -o remount,rw /`, `passwd root`, `touch /.autorelabel` y `exec /sbin/init`. Usa `rd.break` como método principal.

### Procesos: ver, priorizar y terminar

```bash
top                            # en vivo; P ordena por CPU, M por memoria, k mata
ps aux --sort=-%cpu | head     # los que más CPU consumen
ps aux --sort=-%mem | head     # los que más memoria consumen
kill 1234                      # señal 15 (terminar amable)
kill -9 1234                   # señal 9 (forzar)
pkill -u ana ; killall dd      # por usuario o por nombre
nice -n 10 tar -czf /tmp/b.tgz /usr   # arranca con prioridad más baja
renice -n 5 -p 1234            # fija nice 5 a un proceso vivo
ps -o pid,ni,cmd -p 1234       # comprueba el valor nice
# nice va de -20 (más prioridad) a 19 (menos). Por defecto es 0.
# Un usuario normal solo puede subir el nice de SUS procesos; bajarlo es cosa de root.
```

### Perfiles de tuned

```bash
dnf install -y tuned ; systemctl enable --now tuned
tuned-adm list                 # perfiles disponibles
tuned-adm recommend            # el que sugiere para este equipo
tuned-adm profile virtual-guest   # aplica un perfil
tuned-adm active               # perfil en uso
```

### Logs y journal

```bash
journalctl -u sshd             # logs de un servicio
journalctl -p err -b           # errores del arranque actual
journalctl --since "10 min ago" -f   # recientes y en vivo
journalctl --list-boots        # arranques guardados
tail -f /var/log/messages      # log clásico de rsyslog
tail /var/log/secure           # accesos y autenticación
```

### Journal persistente

Por defecto (`Storage=auto` y sin `/var/log/journal`) el journal vive en `/run/log/journal` y se borra al reiniciar.

```bash
mkdir -p /etc/systemd/journald.conf.d
printf '[Journal]\nStorage=persistent\n' > /etc/systemd/journald.conf.d/persist.conf
systemctl restart systemd-journald   # crea /var/log/journal y guarda en disco
```

### Servicios de red y copia segura

```bash
systemctl status sshd ; systemctl enable --now sshd
systemctl stop cups ; systemctl start cups ; systemctl restart chronyd
scp /root/a.txt ana@srv2:/tmp/          # copia a otro equipo
scp -r ana@srv2:/etc/httpd /root/       # copia desde otro equipo
sftp ana@srv2                           # sesión interactiva: put, get, ls, bye
rsync -avz /datos/ ana@srv2:/respaldo/  # sincroniza solo lo que cambió
```

## Así lo piden en el examen

- "No conoces la contraseña de root: cámbiala a `redhat`": método `rd.break` desde la consola, sin olvidar `/.autorelabel`.
- "Configura el journal para que sea persistente tras reiniciar": `Storage=persistent` y reinicia `systemd-journald`.
- "Aplica el perfil de tuned recomendado": `tuned-adm recommend` y luego `tuned-adm profile <perfil>`.
- "Un proceso consume mucha CPU: termínalo" o "ejecuta X con nice 10": `top`/`ps` para el PID, luego `kill` o `nice`.

## Errores típicos

- Olvidar `touch /.autorelabel`: root no puede entrar porque `/etc/shadow` queda mal etiquetado.
- No remontar `/sysroot` en lectura/escritura antes de `chroot`.
- Crear `/var/log/journal` sin reiniciar journald: sigue guardando en memoria.
- Usar `kill -9` de entrada: primero prueba la señal 15.
- No reiniciar al final del examen para comprobar que todo sobrevive.

## Chequeo rápido

- `journalctl --list-boots` muestra más de un arranque si el journal es persistente.
- `tuned-adm active` confirma el perfil aplicado.
- Tras el reseteo, inicia sesión como root en la consola con la nueva contraseña.
