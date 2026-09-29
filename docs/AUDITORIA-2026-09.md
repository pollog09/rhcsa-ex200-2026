# Auditoría contra el temario oficial EX200 (29/09/2026)

**Fuente:** [página oficial del EX200](https://www.redhat.com/en/services/training/ex200-red-hat-certified-system-administrator-rhcsa-exam). Confirma que el examen se basa en **RHEL 10**, que es práctico y que tiene 10 dominios con **62 objetivos**. Los detalles técnicos se contrastaron con la [documentación de RHEL 10](https://docs.redhat.com/en/documentation/red_hat_enterprise_linux/10).

## Resultado

- **Los 62 objetivos están cubiertos.** Cada uno se explica en su tema y tiene al menos un ejercicio (ver [COBERTURA-EX200.md](COBERTURA-EX200.md)).
- **Se mantienen 111 ejercicios.** Dos se reemplazaron porque quedaban fuera del temario o repetían otro.
- **Nueva página `/objetivos` en el sitio.** Es una checklist de los 62 objetivos oficiales, cada uno enlazado a sus ejercicios.
- **`npm run validate` comprueba la cobertura.** Falla si un objetivo se queda sin ejercicio o si apunta a un id que no existe.

## Cambios principales

### Ejercicios reemplazados (fuera del temario o redundantes)
| Id | Antes | Ahora | Motivo |
|---|---|---|---|
| `herr-04` | tar con xz | tar.gz (crear y extraer con `-C`) y bzip2/bunzip2 | El objetivo nombra solo tar, gzip y bzip2 |
| `herr-13` | chmod (repetía `herr-06`) | Documentación: `man -k`, `mandb`, `man 5`, `/usr/share/doc` | La documentación no tenía tarea práctica |

### Correcciones para RHEL 10
- **Flatpak:** el remoto oficial es `rhel` (`https://flatpaks.redhat.io/rhel.flatpakrepo`), no Flathub. Se documenta cómo autenticarse cuando no hay suscripción.
- **dnf:** RHEL 10 usa dnf 4, así que `dnf config-manager --add-repo` es correcto. Se agregó `rpm --import` para trabajar con `gpgcheck=1`.
- **gdisk:** no existe en los repositorios de RHEL 10. Se reemplazó por `fdisk` o `parted` en el tema 05, en `alm-08` y en la chuleta.
- **XFS:** exige un tamaño mínimo de unos 300 MiB (xfsprogs 5.19 o posterior). Se añadió al tema y se comprobó que ningún ejercicio crea un XFS más pequeño.
- **Journal:** por defecto (`Storage=auto`, sin `/var/log/journal`) se guarda en `/run/log/journal` y se pierde al reiniciar. Corregido en el tema 04 y en `oper-10`.
- **nice/renice:** el rango va de -20 a 19. Un usuario normal solo puede subir el nice de sus propios procesos, y `renice -n` fija un valor absoluto.
- **Bootloader:** `grubby` edita las entradas BLS directamente. Si cambias `GRUB_CMDLINE_LINUX`, `grub2-mkconfig` necesita `--update-bls-cmdline`. La ruta `/boot/grub2/grub.cfg` es la misma en BIOS y en UEFI.
- **Redes:** en RHEL 10 los perfiles son keyfile (`/etc/NetworkManager/system-connections/*.nmconnection`) y ifcfg ya no se admite. Las verificaciones revisan el keyfile.
- **SSH:** `PermitRootLogin` vale `prohibit-password` por defecto. El drop-in de ejemplo se renombró a `00-*.conf`, porque sshd aplica el primer valor que lee.
- **umask:** el valor por defecto es 0022 y se define en `UMASK` de `/etc/login.defs`, que aplica `pam_umask`.
- **Contraseña de root:** se mantiene `rd.break` (con remount de `/sysroot`, chroot, `passwd` y `/.autorelabel`) como método documentado. `init=/bin/bash` queda como alternativa no documentada.
- **SELinux:** `seg-07` usa ahora `httpd_can_network_connect` en lugar del booleano de FTP, porque FTP está fuera del temario.
- **Persistencia:** se añadieron comprobaciones tras reiniciar en `red-02`, `red-03`, `red-04`, `red-07`, `desp-09` y `seg-12`.

### Temario
- Se amplió con lo que faltaba:
  - Herramientas: `su` frente a `su -`, `tar -x`, `gunzip`/`bunzip2` e `info`.
  - Usuarios: valores por defecto de `useradd` (`useradd -D`, `/etc/skel`), `visudo -c`, la regla `%wheel` y la trampa de los archivos con punto en `sudoers.d`.
  - Almacenamiento: `vgreduce` y `pvmove`, etiquetas (`xfs_admin -L`, `e2label`, `fatlabel`), `nofail` y `findmnt --verify`.
  - NFS: autofs con `-fstype=nfs4`, y que `showmount` usa NFSv3.
- **Fuera del examen RHEL 10:** Stratis, VDO, Podman, Samba y FTP. Apache (httpd) aparece solo como servicio de ejemplo.

### Laboratorio (`/laboratorio`)
- Se reemplazó `cp -a` desde la ISO por `cp -r` + `restorecon -R`. Con `cp -a` los archivos conservaban el contexto SELinux de la ISO y httpd devolvía 403.
- Se añadieron:
  - `exportfs -rv`
  - un `.repo` de ejemplo con `gpgcheck=1`
  - un usuario `ldapuser01` con el mismo UID en las dos VMs, para practicar autofs con homes remotos

## Puntos sin fuente oficial de RHEL 10 (revisar en una VM)
1. **Reseteo de root:** docs.redhat.com no publica todavía el procedimiento para RHEL 10. El último oficial es el de RHEL 9 (`rd.break`).
2. **`passwd --stdin`:** shadow-utils 4.15 lo incluye, pero no hay una nota explícita de Red Hat. `chpasswd` se ofrece como alternativa.
3. **umask 0022:** el dato viene del `login.defs` de CentOS Stream 10 y de la documentación de RHEL 9.
4. **Journal:** falta confirmar en una instalación limpia que ningún paquete crea `/var/log/journal`.
5. **`xfs_admin -L`:** se mantiene la indicación de desmontar antes de etiquetar.
6. **dosfstools:** puede faltar en instalaciones mínimas con BIOS. Si falta, `dnf install dosfstools`.
