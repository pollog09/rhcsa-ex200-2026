---
slug: usuarios-grupos
orden: 9
titulo: "Usuarios y grupos"
resumen: "Aprenderás a crear y modificar cuentas, gestionar contraseñas y su caducidad, grupos y permisos de sudo."
dias: [3]
---

## En palabras simples

Cada usuario es una credencial de empleado con un número (UID); cada grupo es un departamento (GID).
`/etc/passwd` es la lista de empleados, `/etc/shadow` guarda las contraseñas cifradas y `/etc/group` los departamentos.
La caducidad de la contraseña es como la fecha de vencimiento de la credencial: obliga a renovarla.
`sudo` es un permiso firmado que deja a alguien hacer tareas de administrador sin conocer la clave de root.

## Comandos clave

### Crear, modificar y borrar usuarios

```bash
useradd ana                              # usuario con valores por defecto
useradd -u 2000 -G wheel -c "Ana Pérez" ana   # UID fijo y grupo extra
useradd -s /sbin/nologin servicio1       # sin shell interactiva
usermod -aG ventas ana                   # agrega a un grupo sin quitar otros
usermod -s /bin/bash servicio1           # cambia la shell
usermod -L ana ; usermod -U ana          # bloquea y desbloquea
userdel -r luis                          # borra el usuario y su home
id ana                                   # UID, GID y grupos
useradd -D                               # valores por defecto (HOME=/home, SHELL=/bin/bash, SKEL=/etc/skel)
```

Por defecto `useradd` crea el home copiando `/etc/skel`, un grupo privado con el mismo nombre y un UID desde 1000 (`UID_MIN` en `/etc/login.defs`). Esos valores salen de `/etc/login.defs` y `/etc/default/useradd`.

### Contraseñas

```bash
passwd ana                               # asigna o cambia la contraseña
echo 'Clave2026' | passwd --stdin ana    # sin preguntar (existe en RHEL 10)
echo 'ana:Clave2026' | chpasswd          # sin interacción (útil en scripts)
passwd -l ana ; passwd -u ana            # bloquea y desbloquea
```

### Envejecimiento de contraseñas

```bash
chage -l ana                             # ver la política actual
chage -M 90 -m 1 -W 7 ana                # máximo 90 días, mínimo 1, aviso 7
chage -d 0 ana                           # obliga a cambiarla al entrar
chage -E 2026-12-31 ana                  # la cuenta vence ese día
vim /etc/login.defs                      # valores para usuarios NUEVOS
# PASS_MAX_DAYS 60      (por defecto 99999: nunca caduca)
# PASS_MIN_DAYS 0
# PASS_WARN_AGE 7
# la complejidad de la contraseña se define en /etc/security/pwquality.conf
```

### Grupos

```bash
groupadd ventas                          # grupo nuevo
groupadd -g 3000 soporte                 # con GID fijo
gpasswd -a ana ventas                    # agrega miembro
gpasswd -d ana ventas                    # quita miembro
gpasswd -A ana ventas                    # ana administra el grupo
groupmod -n comercial ventas             # renombra
groupdel soporte                         # borra
getent group ventas                      # miembros del grupo
```

### sudo

```bash
visudo -f /etc/sudoers.d/admins          # edita con verificación de sintaxis
# %admins  ALL=(ALL)  ALL                         grupo con todos los permisos
# ana      ALL=(ALL)  NOPASSWD: ALL               sin pedir contraseña
# luis     ALL=/usr/bin/systemctl restart httpd   solo un comando
visudo -c                                # valida la sintaxis de /etc/sudoers y sudoers.d
usermod -aG wheel ana                    # wheel ya tiene sudo en RHEL (%wheel ALL=(ALL) ALL)
sudo -l -U ana                           # qué puede hacer ana
su - ana -c 'sudo -l'                    # probar como ana
```

## Así lo piden en el examen

- "Crea `sarah` sin shell interactiva y `harry` y `natasha` con grupo secundario `sysmgrs`": `groupadd`, `useradd -G`, `useradd -s /sbin/nologin`.
- "El usuario `alex` debe tener UID 3456 y contraseña `flectrag`": `useradd -u 3456 alex` y `passwd` o `chpasswd`.
- "Las contraseñas nuevas deben caducar a los 20 días": `PASS_MAX_DAYS 20` en `/etc/login.defs`.
- "Los miembros de `admin` pueden usar sudo sin contraseña": regla con `NOPASSWD` en `/etc/sudoers.d/`.

## Errores típicos

- Usar `usermod -G` sin `-a`: el usuario pierde sus otros grupos.
- Editar `/etc/login.defs` y esperar que afecte a usuarios que ya existen: para ellos usa `chage`.
- Editar sudoers con `vim` directo y dejar un error de sintaxis: usa siempre `visudo`.
- Olvidar el `%` delante del nombre de grupo en sudoers.
- Poner un punto en el nombre del archivo de `/etc/sudoers.d/` (`admins.conf`): sudo lo ignora. Déjalo con dueño root y modo 440.
- Crear el grupo después del usuario que lo necesita.

## Chequeo rápido

- `id harry` y `getent passwd sarah` muestran grupos y shell.
- `chage -l alex` confirma la caducidad.
- `visudo -c` valida la sintaxis de todos los archivos de sudoers.
