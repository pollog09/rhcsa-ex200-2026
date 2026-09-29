## Cómo es el examen

- **100% práctico.** Te dan una o dos máquinas virtuales y una lista de tareas. No hay preguntas de opción múltiple.
- **Duración:** alrededor de 3 horas. **Aprobado:** 210 de 300 puntos. Confirma los detalles en la [página oficial del EX200](https://www.redhat.com/es/services/training/ex200-red-hat-certified-system-administrator-rhcsa-exam).
- **Sin internet.** Solo tienes `man`, `info`, `--help` y `/usr/share/doc`.
- **Se corrige después de reiniciar.** Lo que no sobreviva a un reinicio cuenta como no hecho.

## Antes de empezar las tareas

1. **Lee todo el examen primero** (5 minutos). Algunas tareas dependen de otras, por ejemplo un usuario que después usas en un cron.
2. Si una tarea pide **recuperar la contraseña de root** o **configurar la red**, hazla **primero**: sin ella no puedes avanzar.
3. Anota en papel los datos importantes: IPs, nombres, tamaños y UUIDs.

## Durante el examen

- **Persistencia siempre:** `--permanent` en firewall-cmd, `-P` en setsebool, `enable` en systemctl, entradas en `/etc/fstab`.
- Después de editar `/etc/fstab`, ejecuta `systemctl daemon-reload` y `mount -a`. **Un fstab roto impide arrancar**: revísalo con `findmnt --verify`.
- **No desactives SELinux.** Si algo falla, busca el contexto o el puerto correcto (`semanage`, `restorecon`).
- Si una tarea se te traba más de 10 minutos, **sáltala** y vuelve al final.
- Usa `man` sin miedo. Por ejemplo, `man 5 crontab` trae el formato completo y `man semanage-fcontext` trae ejemplos que se pueden copiar.

## Los últimos 20 minutos

1. **Reinicia** la máquina (`systemctl reboot`).
2. Comprueba que arranca bien y verifica cada tarea: `findmnt`, `swapon --show`, `systemctl is-enabled`, `firewall-cmd --list-all`, `getenforce`.
3. Si algo no arranca, arréglalo antes de que se acabe el tiempo.

## Errores que hacen perder el examen

| Error | Cómo evitarlo |
|---|---|
| El sistema no arranca por un `/etc/fstab` mal escrito | `findmnt --verify` y `mount -a` antes de reiniciar |
| Olvidar `--permanent` en el firewall | Siempre `--permanent` + `--reload` |
| SELinux en permissive o disabled | `getenforce` debe decir `Enforcing` |
| Contraseña de root reseteada sin `touch /.autorelabel` | Sigue el procedimiento completo |
| Servicio iniciado pero no habilitado | `systemctl enable --now` |
| Swap o LV creados sin entrada en fstab | Verifica tras reiniciar |

## Sobre los "dumps" de preguntas

Hay sitios, como [ExamTopics](https://www.examtopics.com/exams/redhat/ex200/), que publican preguntas "del examen real". Úsalos, como mucho, para ver **qué temas** se practican. **No memorices respuestas.** El examen es práctico y cambia, y usar material filtrado va contra el acuerdo de confidencialidad de Red Hat, que puede **revocar tu certificación**. Todos los ejercicios de este sitio son originales.
