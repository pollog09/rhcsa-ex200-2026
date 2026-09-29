---
slug: almacenamiento-local
orden: 5
titulo: "Almacenamiento local"
resumen: "Aprenderás a particionar discos GPT, crear y borrar volúmenes LVM, montar por UUID y agregar swap."
dias: [6]
---

## En palabras simples

Un disco es como un terreno vacío: primero lo divides en lotes (particiones) y luego construyes encima (sistema de archivos).
LVM es un terreno elástico: juntas varios lotes en un gran grupo (VG) y de ahí sacas volúmenes (LV) del tamaño que quieras.
El archivo `/etc/fstab` es la lista de lo que se monta solo cada vez que el servidor arranca.
La swap es una bodega de reserva: cuando la memoria se llena, el sistema guarda ahí lo que menos usa.

## Comandos clave

### Ver discos

```bash
lsblk                          # discos, particiones y puntos de montaje
lsblk -f ; blkid               # sistemas de archivos, UUID y LABEL
parted /dev/vdb print          # tabla de particiones
```

### Particiones GPT

```bash
parted /dev/vdb mklabel gpt                    # tabla GPT (solo en disco nuevo)
parted /dev/vdb mkpart datos xfs 1MiB 1GiB     # partición de 1 GiB
parted /dev/vdb mkpart lvm 1GiB 3GiB
parted /dev/vdb set 2 lvm on                   # marca la partición 2 para LVM
udevadm settle                                 # espera a que aparezca el dispositivo
# alternativas interactivas: fdisk /dev/vdb  o  gdisk /dev/vdb
# (n = nueva, t = tipo, p = mostrar, w = guardar)
```

### LVM: crear

```bash
pvcreate /dev/vdb2                        # volumen físico
vgcreate -s 8M vgdatos /dev/vdb2          # grupo con extensiones de 8 MiB
lvcreate -n lvdatos -L 500M vgdatos       # volumen de 500 MiB
lvcreate -n lvapp -l 50 vgdatos           # volumen de 50 extensiones
mkfs.xfs /dev/vgdatos/lvdatos             # formatea
pvs ; vgs ; lvs                           # resumen de cada capa
vgdisplay vgdatos                         # detalle, incluye el tamaño de PE
```

### LVM: borrar (de arriba hacia abajo)

```bash
umount /datos                             # y quita su línea de /etc/fstab
lvremove -y /dev/vgdatos/lvdatos
vgremove vgdatos
pvremove /dev/vdb2
```

### Montaje persistente por UUID o LABEL

```bash
mkdir /datos
blkid /dev/vgdatos/lvdatos                # copia el UUID
vim /etc/fstab
# UUID=1234-abcd  /datos  xfs  defaults  0 0
# LABEL=backup    /backup ext4 defaults  0 0
systemctl daemon-reload                   # que systemd lea el fstab nuevo
mount -a                                  # prueba el fstab sin reiniciar
findmnt /datos
```

### Swap sin tocar datos existentes

```bash
parted /dev/vdb mkpart swap linux-swap 3GiB 3.5GiB   # usa espacio libre
mkswap /dev/vdb3                          # prepara la swap y muestra su UUID
# en /etc/fstab:  UUID=...  none  swap  defaults  0 0
swapon -a                                 # activa lo que está en fstab
swapon --show ; free -h
# swap en LVM: lvcreate -n lvswap -L 512M vgdatos ; mkswap /dev/vgdatos/lvswap
```

### Fuera del examen RHEL 10

Stratis (`stratis pool create`) y VDO se ven en el curso, pero están fuera del examen RHEL 10.

## Así lo piden en el examen

- "Crea un VG `vgexam` con extensiones de 16 MiB y un LV `lvexam` de 60 extensiones, montado en `/exam` con ext4": `vgcreate -s 16M`, `lvcreate -l 60`, `mkfs.ext4` y fstab por UUID.
- "Agrega 512 MiB de swap sin afectar la swap actual": nueva partición o LV, `mkswap`, fstab y `swapon -a`.
- "Borra el volumen lógico `lvviejo`": desmonta, quita la línea de fstab y `lvremove`.
- "Monta la partición con etiqueta `backup` en `/backup`": `LABEL=backup` en fstab.

## Errores típicos

- Crear una tabla GPT nueva sobre un disco con datos: borra todo. Usa `print` primero.
- Escribir mal una línea de fstab: el servidor no arranca. Prueba siempre con `mount -a`.
- Olvidar `systemctl daemon-reload` tras editar fstab.
- Poner la swap con punto de montaje en vez de `none`.
- Confundir `-L` (tamaño) con `-l` (número de extensiones).

## Chequeo rápido

- `lsblk -f` muestra cada capa y su punto de montaje.
- `mount -a && findmnt --verify` no debe mostrar errores.
- `swapon --show` lista la swap nueva; reinicia y vuelve a comprobar.
