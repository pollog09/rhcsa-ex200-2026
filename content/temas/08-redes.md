---
slug: redes
orden: 8
titulo: "Redes"
resumen: "Aprenderás a configurar IPv4 e IPv6 con nmcli, el nombre del equipo, la resolución DNS y el firewall."
dias: [5, 8]
---

## En palabras simples

Configurar la red es como darle una dirección postal a tu casa: IP (la calle y número), máscara (el barrio), gateway (la salida a la avenida) y DNS (la guía telefónica).
NetworkManager guarda esa dirección en un perfil, y `nmcli` es la forma de escribirlo desde la terminal.
El hostname es el nombre en el buzón, y `/etc/hosts` es una libreta de direcciones local.
El firewall es la reja: decide qué puertas (puertos o servicios) quedan abiertas.

## Comandos clave

### Ver el estado

```bash
ip -br addr                     # IPs por interfaz
ip route                        # rutas y gateway
nmcli device status             # interfaces y su perfil
nmcli connection show           # perfiles guardados
ss -tlnp                        # puertos TCP escuchando
```

### IPv4 fija con nmcli

```bash
nmcli con add con-name estatica ifname enp1s0 type ethernet \
  ipv4.method manual ipv4.addresses 192.168.10.20/24 \
  ipv4.gateway 192.168.10.1 ipv4.dns 192.168.10.1
nmcli con mod estatica connection.autoconnect yes   # activa al arranque
nmcli con up estatica
# modificar un perfil existente:
nmcli con mod "Wired connection 1" ipv4.addresses 10.0.0.5/24 ipv4.method manual
nmcli con mod estatica +ipv4.addresses 192.168.10.21/24   # segunda IP
```

### IPv6

```bash
nmcli con mod estatica ipv6.method manual \
  ipv6.addresses 2001:db8::20/64 ipv6.gateway 2001:db8::1
nmcli con up estatica
ip -6 addr show enp1s0
ping -6 -c2 2001:db8::1
```

### Hostname y resolución de nombres

```bash
hostnamectl set-hostname servidor1.ejemplo.com   # persistente
hostnamectl                                     # comprueba
echo "192.168.10.30 srv2.ejemplo.com srv2" >> /etc/hosts
nmcli con mod estatica ipv4.dns "8.8.8.8 1.1.1.1" ipv4.dns-search ejemplo.com
nmcli con up estatica
cat /etc/resolv.conf              # lo escribe NetworkManager
getent hosts srv2                 # resuelve usando hosts y DNS
dig +short redhat.com             # consulta DNS (paquete bind-utils)
```

### Servicios de red al arranque

```bash
systemctl enable --now NetworkManager sshd
systemctl is-enabled sshd
```

### Firewall con firewall-cmd

```bash
firewall-cmd --state
firewall-cmd --get-default-zone
firewall-cmd --list-all                          # zona activa
firewall-cmd --permanent --add-service=http      # abre un servicio
firewall-cmd --permanent --add-port=8080/tcp     # abre un puerto
firewall-cmd --permanent --remove-service=cockpit
firewall-cmd --reload                            # aplica lo permanente
firewall-cmd --get-services | tr ' ' '\n' | grep nfs   # nombres válidos
```

## Así lo piden en el examen

- "Configura IP 172.25.250.11/24, gateway 172.25.250.254 y DNS 172.25.250.254": `nmcli con mod` sobre el perfil existente y `nmcli con up`.
- "Agrega la IPv6 `fd00::11/64` sin quitar la IPv4": `ipv6.method manual ipv6.addresses ...`.
- "El hostname debe ser `node1.lab.example.com`": `hostnamectl set-hostname`.
- "Permite el acceso web desde fuera": `--permanent --add-service=http` y `--reload`.

## Errores típicos

- Cambiar la IP sin `nmcli con up`: el cambio queda guardado pero no aplicado.
- Olvidar `ipv4.method manual`: el perfil sigue pidiendo IP por DHCP.
- Editar `/etc/resolv.conf` a mano: NetworkManager lo sobrescribe.
- Olvidar `--permanent` en `firewall-cmd`: se pierde al reiniciar; o usarlo sin `--reload` y no ver el cambio.
- Cortarte la conexión SSH al cambiar la IP por red: hazlo desde la consola.

## Chequeo rápido

- `nmcli con show estatica | grep -E 'ipv[46].(method|addresses)'` muestra lo configurado.
- `ip -br addr ; hostnamectl ; getent hosts srv2` confirman IP, nombre y resolución.
- `firewall-cmd --list-all --permanent` debe coincidir con `firewall-cmd --list-all`.
