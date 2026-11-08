# Módulos de dominio

Cada carpeta representa un módulo del backend. Una página solo debe consumir hooks del módulo; los hooks usan services y únicamente los services deciden entre API real y mocks.

```text
page -> hook -> service -> mock | api
```

No importes un archivo de `mocks` desde componentes, hooks o páginas.
