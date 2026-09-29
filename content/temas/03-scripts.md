---
slug: scripts
orden: 3
titulo: "Scripts en Bash"
resumen: "Aprenderás a escribir scripts sencillos con condiciones, bucles, argumentos y salida de comandos."
dias: [7]
---

## En palabras simples

Un script es una receta: escribes los pasos una vez y el servidor los repite cuando quieras.
`if` es una bifurcación en el camino: si se cumple algo, haces una cosa; si no, otra.
`for` es como repartir volantes casa por casa: repite la misma acción para cada elemento de una lista.
`$1` y `$2` son los datos que le pasas al script al llamarlo, como los ingredientes de la receta.

## Comandos clave

### Estructura básica

```bash
#!/bin/bash
# primera línea: qué intérprete usa
nombre="mundo"
echo "Hola $nombre"
```

```bash
chmod +x /usr/local/bin/saludo.sh   # permiso de ejecución
/usr/local/bin/saludo.sh            # ejecución por ruta
bash -x saludo.sh                   # ejecuta mostrando cada paso (depurar)
```

### Argumentos y variables especiales

```bash
echo "Primer argumento: $1"
echo "Segundo argumento: $2"
echo "Cantidad de argumentos: $#"
echo "Todos: $@"
echo "Código de salida del último comando: $?"
```

### Condiciones con test y [ ]

```bash
if [ $# -ne 1 ]; then
  echo "Uso: $0 <usuario>" >&2
  exit 1
fi

if [ -f /etc/hosts ]; then echo "existe el archivo"; fi
if [ -d /datos ]; then echo "existe la carpeta"; fi
if [ "$1" = "ana" ]; then echo "es ana"; elif [ -z "$1" ]; then echo "vacío"; else echo "otro"; fi
if id "$1" &>/dev/null; then echo "el usuario existe"; fi
# comparaciones numéricas: -eq -ne -lt -le -gt -ge
# texto: = != -z (vacío) -n (no vacío)
```

### Bucles for

```bash
for u in ana luis marta; do
  useradd "$u"
done

for i in {1..5}; do echo "Número $i"; done

for f in /var/log/*.log; do
  echo "$f ocupa $(du -h "$f" | cut -f1)"
done
```

### Procesar la salida de comandos

```bash
hoy=$(date +%F)                          # guarda la salida en una variable
usuarios=$(awk -F: '$3>=1000 {print $1}' /etc/passwd)
for u in $usuarios; do echo "Usuario: $u"; done

while read -r linea; do                  # recorre un archivo línea a línea
  echo "-> $linea"
done < /root/lista.txt
```

### Ejemplo completo tipo examen

```bash
#!/bin/bash
# busca archivos de más de 30k en /usr/share y los copia a /root/grandes
mkdir -p /root/grandes
for f in $(find /usr/share -type f -size +30k 2>/dev/null); do
  cp "$f" /root/grandes/     # ojo: $(...) parte por espacios; con nombres raros usa find -exec
done
```

## Así lo piden en el examen

- "Crea `/usr/local/bin/buscar` que liste los archivos de `/usr` menores de 10M con permiso SGID": usa `find /usr -type f -size -10M -perm -2000` dentro del script y dale `chmod +x`.
- "Si el argumento es `a` imprime `b`, si es `b` imprime `a`, si no, muestra el uso y sale con 1": `if`/`elif`/`else` con `exit 1`.
- "Crea los usuarios listados en `/root/usuarios.txt`": `while read -r u; do useradd "$u"; done < /root/usuarios.txt`.
- "El script debe guardar su resultado en `/root/salida.txt`": redirige con `>` dentro o al llamarlo.

## Errores típicos

- Olvidar `#!/bin/bash` o el permiso `+x`.
- No dejar espacios dentro de los corchetes: `[ -f x ]`, no `[-f x]`.
- Usar `=` para números o `-eq` para texto.
- No poner comillas a las variables: `"$1"` evita errores con espacios o valores vacíos.
- Dejar el script en una ruta distinta a la pedida.

## Chequeo rápido

- `bash -n script.sh` revisa la sintaxis sin ejecutar.
- `ls -l /usr/local/bin/buscar` debe mostrar la `x`.
- Ejecuta el script con y sin argumentos y mira `echo $?`.
