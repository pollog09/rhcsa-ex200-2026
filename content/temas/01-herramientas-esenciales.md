---
slug: herramientas-esenciales
orden: 1
titulo: "Herramientas esenciales"
resumen: "Aprenderás a moverte en la terminal, manejar archivos, buscar texto, comprimir y leer permisos básicos."
dias: [2, 3]
---

## En palabras simples

La terminal es como hablar con el servidor por mensajes de texto: escribes una orden y te responde.
Los archivos son papeles dentro de carpetas, y tú los copias, mueves o tiras a la basura con comandos cortos.
La redirección es un embudo: en vez de mostrar la respuesta en pantalla, la guardas en un archivo o se la pasas a otro comando.
Un enlace es un acceso directo: el simbólico apunta al nombre y el duro es otro nombre para el mismo contenido.
Si no recuerdas algo, el manual (`man`) está siempre dentro del sistema, también en el examen.

## Comandos clave

### Redirección y tuberías

```bash
ls /etc > lista.txt           # guarda la salida (sobrescribe)
date >> lista.txt             # agrega al final sin borrar
find / -name passwd 2> /dev/null   # descarta los errores
comando &> todo.txt           # salida y errores al mismo archivo
cat /etc/passwd | wc -l       # la salida de uno entra al siguiente
```

### grep y expresiones regulares

```bash
grep root /etc/passwd          # líneas que contienen "root"
grep -i error /var/log/messages   # sin distinguir mayúsculas
grep -v '^#' /etc/ssh/sshd_config # quita líneas que empiezan con #
grep -E '^(ana|luis):' /etc/passwd  # regex extendida
grep -r 'PermitRootLogin' /etc/ssh/   # busca dentro de una carpeta
```

### Archivos y carpetas

```bash
mkdir -p /datos/2026/enero     # crea la ruta completa
touch nota.txt                 # crea un archivo vacío
cp -r /etc/skel /tmp/copia     # copia una carpeta entera
cp -a origen/ destino/         # copia conservando permisos y dueños
mv nota.txt /tmp/              # mueve o renombra
rm -r /tmp/copia               # borra una carpeta y su contenido
find /home -user ana -type f   # archivos cuyo dueño es ana
find / -size +10M 2>/dev/null  # archivos de más de 10 MB
```

### Enlaces duros y simbólicos

```bash
ln /datos/a.txt /datos/a_duro.txt     # enlace duro (mismo inodo)
ln -s /etc/hosts /root/hosts_link     # enlace simbólico
ls -li /datos                         # muestra el inodo y el contador de enlaces
```

### Comprimir y empaquetar

```bash
tar -czf /root/etc.tar.gz /etc        # empaqueta y comprime con gzip
tar -cjf /root/etc.tar.bz2 /etc       # igual, con bzip2
tar -tf /root/etc.tar.gz              # lista el contenido sin extraer
tar -xzf /root/etc.tar.gz -C /tmp/r   # extrae en otra carpeta (la carpeta debe existir)
tar -xjf /root/etc.tar.bz2 -C /tmp/r  # extrae un .tar.bz2 (tar -xf también detecta la compresión)
gzip archivo ; gunzip archivo.gz      # comprime y descomprime (reemplaza el original)
bzip2 archivo ; bunzip2 archivo.bz2   # igual con bzip2 (también bzip2 -d)
```

### Permisos ugo/rwx

```bash
ls -l archivo                  # -rw-r--r-- = dueño, grupo, otros
chmod 750 script.sh            # rwx para dueño, r-x grupo, nada otros
chmod u+x,g-w,o= archivo       # modo simbólico
chown ana:ventas archivo       # cambia dueño y grupo
```

### Entrar, cambiar de usuario y editar

```bash
ssh ana@servidor1              # sesión remota
su - ana                       # cambia a ana con SU entorno (shell de login, va a su home)
su ana                         # cambia a ana pero conserva tu entorno y tu carpeta actual
exit                           # vuelve al usuario anterior
vim archivo                    # i para escribir, Esc, :wq para guardar y salir
```

### Documentación

```bash
man tar                        # manual; / busca, q sale
man -k partition               # busca páginas por palabra clave (igual que apropos)
mandb                          # regenera el índice si man -k no encuentra nada
man 5 passwd                   # sección 5: formato de archivos; la 1 es comandos, la 8 administración
info coreutils                 # documentación en formato info (n/p navegan, q sale)
ls /usr/share/doc/             # ejemplos y documentación de paquetes
```

## Así lo piden en el examen

- "Busca todos los archivos del usuario `harry` y cópialos a `/root/encontrados`": usa `find / -user harry -type f -exec cp -a {} /root/encontrados/ \;`.
- "Guarda en `/root/lineas.txt` las líneas de `/usr/share/dict/words` que contienen `ich`": `grep ich /usr/share/dict/words > /root/lineas.txt`.
- "Crea un respaldo comprimido con bzip2 de `/usr/local` en `/root/local.tar.bz2`": `tar -cjf /root/local.tar.bz2 /usr/local` y revisa con `tar -tjf`.
- "Crea un enlace simbólico `/root/red` que apunte a `/etc/NetworkManager`": `ln -s /etc/NetworkManager /root/red`.

## Errores típicos

- Usar `>` cuando pedían agregar: borra lo que había. Para sumar usa `>>`.
- Olvidar `-r` al copiar o borrar carpetas.
- Usar `su` sin guion cuando piden el entorno del otro usuario: sigues con tu PATH y tu carpeta.
- Confundir el orden en `ln -s`: primero el destino real, después el nombre del enlace.
- Extraer un `.tar.bz2` con `-z`: la letra tiene que coincidir con la compresión (o deja que `tar -xf` la detecte).
- Crear el archivo pedido con otro nombre o en otra ruta: el corrector revisa la ruta exacta.

## Chequeo rápido

- `ls -l /root/lineas.txt && wc -l /root/lineas.txt` para ver que existe y tiene contenido.
- `tar -tf /root/local.tar.bz2 | head` para confirmar qué quedó dentro del respaldo.
- `ls -l /root/red` debe mostrar `-> /etc/NetworkManager`.
