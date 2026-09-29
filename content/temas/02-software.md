---
slug: software
orden: 2
titulo: "Instalar software"
resumen: "Aprenderás a configurar repositorios, instalar y quitar paquetes RPM y aplicaciones Flatpak."
dias: [4]
---

## En palabras simples

Un repositorio es como una tienda de aplicaciones: `dnf` va a la tienda, busca el paquete y lo instala con todo lo que necesita.
`rpm` es la etiqueta de cada paquete: te dice qué instalaste y qué archivos trajo.
Flatpak es otra tienda distinta, pensada para aplicaciones de escritorio que llevan sus propias dependencias dentro.
En el examen muchas veces no hay internet: te dan la dirección de un repositorio y tú tienes que configurarlo a mano.

## Comandos clave

### Consultar e instalar con dnf

```bash
dnf repolist                    # repositorios habilitados
dnf search nginx                # busca por nombre o descripción
dnf info httpd                  # detalles del paquete
dnf provides '*/semanage'       # qué paquete trae ese archivo
dnf install -y httpd            # instala con dependencias
dnf remove -y httpd             # desinstala
dnf update -y                   # actualiza todo
dnf group list                  # grupos de paquetes
dnf history ; dnf history undo 5   # ver y deshacer una transacción
```

### Consultar con rpm

```bash
rpm -qa | grep httpd            # paquetes instalados que coinciden
rpm -qi httpd                   # información del paquete instalado
rpm -ql httpd                   # archivos que instaló
rpm -qf /etc/ssh/sshd_config    # a qué paquete pertenece un archivo
rpm -qc openssh-server          # solo sus archivos de configuración
dnf install -y ./paquete.rpm    # instala un .rpm local resolviendo dependencias
```

### Crear un repositorio a mano

```bash
vim /etc/yum.repos.d/examen.repo
```

```ini
[BaseOS]
name=BaseOS examen
baseurl=http://repo.ejemplo.com/rhel10/BaseOS
enabled=1
gpgcheck=0

[AppStream]
name=AppStream examen
baseurl=http://repo.ejemplo.com/rhel10/AppStream
enabled=1
gpgcheck=0
```

```bash
dnf clean all ; dnf repolist    # limpia caché y comprueba
# alternativa rápida (RHEL 10 usa dnf 4): crea el .repo, revísalo y agrega gpgcheck
dnf config-manager --add-repo http://repo.ejemplo.com/rhel10/BaseOS
dnf config-manager --disable <id> ; dnf config-manager --enable <id>
rpm --import http://repo.ejemplo.com/RPM-GPG-KEY   # si te dan la clave, deja gpgcheck=1
```

### Repositorio local desde la ISO

```bash
mkdir /mnt/iso
mount -o loop,ro /root/rhel-10.iso /mnt/iso   # o /dev/sr0
# baseurl=file:///mnt/iso/BaseOS  y  baseurl=file:///mnt/iso/AppStream
```

### Flatpak

```bash
dnf install -y flatpak                        # si no está instalado
flatpak remote-add --if-not-exists rhel \
  https://flatpaks.redhat.io/rhel.flatpakrepo    # remoto oficial de Red Hat
flatpak remotes                               # lista los repos Flatpak
flatpak remote-ls --app rhel                  # aplicaciones que ofrece el remoto
flatpak search calculator                     # busca aplicaciones
flatpak install -y rhel org.gnome.Calculator  # instala (como root: para todo el sistema)
flatpak list --app                            # aplicaciones instaladas
flatpak run org.gnome.Calculator              # ejecuta
flatpak uninstall -y org.gnome.Calculator     # desinstala
flatpak remote-delete rhel                    # quita el repo
```

Con suscripción activa no necesitas credenciales para el remoto `rhel`. Sin suscripción: `podman login flatpaks.registry.redhat.io` y copia `$XDG_RUNTIME_DIR/containers/auth.json` a `/etc/flatpak/oci-auth.json`. En el examen normalmente te dan un remoto propio con su `.flatpakrepo`.

## Así lo piden en el examen

- "Configura el sistema para usar los repositorios `http://content/rhel10/BaseOS` y `.../AppStream`": crea el `.repo` con ambos bloques y comprueba con `dnf repolist`.
- "Instala el paquete que proporciona el comando `semanage`": `dnf provides '*/semanage'` y luego instálalo.
- "Agrega el repositorio Flatpak que te indican e instala la aplicación X": `flatpak remote-add`, luego `flatpak install <remoto> <id>`.
- "Desinstala el paquete `vsftpd`": `dnf remove -y vsftpd` y verifica con `rpm -q vsftpd`.

## Errores típicos

- Escribir mal la `baseurl` o poner el `[id]` repetido en dos bloques.
- Dejar `gpgcheck=1` sin clave disponible: la instalación falla por firma. Usa la clave que te den o `gpgcheck=0` si lo permiten.
- Olvidar que BaseOS y AppStream son dos repos distintos: con uno solo faltan dependencias.
- Montar la ISO sin agregarla a `/etc/fstab`: tras reiniciar, el repo local desaparece.
- Confundir el nombre corto de la app Flatpak con su ID completo (`org.gnome.Calculator`).

## Chequeo rápido

- `dnf repolist -v` muestra cada repo con su baseurl y número de paquetes.
- `rpm -q httpd` confirma si el paquete está instalado.
- `flatpak list --app` y `flatpak remotes` confirman apps y repos Flatpak.
