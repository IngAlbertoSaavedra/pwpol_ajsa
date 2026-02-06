export function requireRole(...allowed) {
  return (req, res, next) => {
    const perfil = String(req.user?.perfil || "").toLowerCase();

    if (!perfil) {
      return res.status(401).json({ message: "Sin perfil en token." });
    }

    const ok = allowed.map(x => String(x).toLowerCase()).includes(perfil);
    if (!ok) {
      return res.status(403).json({ message: "No tienes permisos para esta acción." });
    }

    next();
  };
}
