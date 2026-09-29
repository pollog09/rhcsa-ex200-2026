---
slug: seguridad
orden: 10
titulo: "Seguridad"
resumen: "Aprenderás a usar firewalld, umask, SSH por clave y a resolver bloqueos de SELinux sin apagarlo."
dias: [3, 5, 8]
---

## En palabras simples

firewalld es la reja del edificio: solo pasan los servicios que tú autorizas.
SELinux es un guardia adicional que revisa la etiqueta de cada proceso y archivo: aunque los permisos digan que sí, si la etiqueta no coincide, no pasa.
Cuando algo falla por SELinux, no lo apagues: corrige la etiqueta, el puerto o el booleano.
La clave SSH es una llave física: más segura que una contraseña que se puede adivinar.

## Comandos clave

### firewalld

```bash
systemctl enable --now firewalld
firewall-cmd --get-active-zones
firewall-cmd --permanent --add-service=https
firewall-cmd --permanent --add-port=82/tcp
firewall-cmd --permanent --zone=internal --add-source=192.168.56.0/24
firewall-cmd --reload              # sin --permanent el cambio se pierde al recargar o reiniciar
firewall-cmd --list-all
```

### umask

```bash
umask                              # valor actual (por defecto 0022 en RHEL 10)
umask 077                          # solo para esta sesión
grep ^UMASK /etc/login.defs        # valor por defecto del sistema (lo aplica pam_umask al iniciar sesión)
echo 'umask 027' >> /home/ana/.bashrc   # persistente para ana
# para todos: un archivo en /etc/profile.d/, p. ej. /etc/profile.d/umask.sh
```

### SSH por clave

```bash
ssh-keygen -t ed25519              # crea la llave en ~/.ssh/
ssh-copy-id ana@servidor2          # copia la pública al servidor
ssh ana@servidor2                  # entra sin contraseña
vim /etc/ssh/sshd_config.d/00-examen.conf
# PasswordAuthentication no
# PermitRootLogin no
sshd -t && systemctl reload sshd   # valida y aplica
sshd -T | grep -i permitrootlogin  # valor efectivo
```

En RHEL 10 `PermitRootLogin` vale `prohibit-password` por defecto (root solo entra con clave). En sshd gana el primer valor leído y los archivos de `sshd_config.d` se leen en orden alfabético: usa un prefijo bajo como `00-`.

### Modos de SELinux

```bash
getenforce                         # Enforcing, Permissive o Disabled
setenforce 0 ; setenforce 1        # permissive / enforcing hasta reiniciar
vim /etc/selinux/config            # SELINUX=enforcing (persistente)
sestatus                           # resumen completo
```

### Contextos

```bash
ls -Z /var/www/html                # contexto de archivos
ps -eZ | grep httpd                # contexto de procesos
dnf install -y policycoreutils-python-utils   # trae semanage en RHEL 10
semanage fcontext -a -t httpd_sys_content_t "/web(/.*)?"   # regla persistente
restorecon -Rv /web                # aplica la regla a lo existente
semanage fcontext -l | grep '^/web'
# chcon -t ... cambia solo hasta el próximo restorecon o reetiquetado
```

### Puertos

```bash
semanage port -l | grep http_port_t
semanage port -a -t http_port_t -p tcp 82   # Apache podrá escuchar en 82
semanage port -d -t http_port_t -p tcp 82   # quitar
```

### Booleanos

```bash
getsebool -a | grep httpd
setsebool -P httpd_enable_homedirs on   # -P lo hace persistente
semanage boolean -l | grep home         # descripción de cada booleano
```

### Leer una denegación

```bash
ausearch -m AVC -ts recent              # denegaciones recientes
journalctl -t setroubleshoot            # explicación, si está instalado
sealert -a /var/log/audit/audit.log     # sugerencia de solución
```

## Así lo piden en el examen

- "Apache debe servir en el puerto 82 con SELinux en enforcing": `semanage port -a`, edita `Listen 82`, abre `82/tcp` en el firewall y reinicia `httpd`.
- "El contenido está en `/web` y da 403": `semanage fcontext` más `restorecon -Rv /web`.
- "SELinux debe estar en enforcing de forma permanente": `/etc/selinux/config` y `setenforce 1`.
- "Configura acceso por clave SSH del usuario X a `servidor2`": `ssh-keygen` y `ssh-copy-id`.

## Errores típicos

- Apagar SELinux para "arreglar" un problema: el examen exige que quede en enforcing.
- Usar `chcon` en vez de `semanage fcontext`: el cambio se pierde con `restorecon`.
- Olvidar `-P` en `setsebool`: el booleano vuelve al valor anterior al reiniciar.
- Olvidar `--permanent` o `--reload` en `firewall-cmd`.
- Mover (`mv`) archivos a la web: conservan su contexto viejo; ejecuta `restorecon`.
- Cerrar el acceso por contraseña antes de probar la clave SSH.

## Chequeo rápido

- `getenforce` debe decir `Enforcing`; `ls -Z` muestra el tipo correcto.
- `curl http://localhost:82` responde y `ausearch -m AVC -ts recent` no muestra nuevas denegaciones.
- `firewall-cmd --list-all --permanent` contiene el servicio o puerto pedido.
