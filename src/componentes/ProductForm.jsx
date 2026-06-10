import { useState } from 'react';

// ── Especificaciones técnicas por categoría ───────────────────────────────
const SPECS_POR_CATEGORIA = {
  Notebook: [
    { key: 'procesador', label: 'Procesador', placeholder: 'Ej: Intel Core i7-1355U' },
    { key: 'ram',        label: 'RAM',         placeholder: 'Ej: 16GB DDR5' },
    { key: 'almacenamiento', label: 'Almacenamiento', placeholder: 'Ej: 512GB NVMe SSD' },
    { key: 'pantalla',   label: 'Pantalla',    placeholder: 'Ej: 15.6" FHD IPS' },
  ],
  'Tarjeta Gráfica': [
    { key: 'vram',       label: 'VRAM',        placeholder: 'Ej: 16GB GDDR6X' },
    { key: 'bus',        label: 'Bus',         placeholder: 'Ej: PCIe 4.0 x16' },
    { key: 'tdp',        label: 'TDP',         placeholder: 'Ej: 320W' },
    { key: 'conector',   label: 'Conector',    placeholder: 'Ej: 16-pin 12VHPWR' },
  ],
  Motherboard: [
    { key: 'socket',     label: 'Socket',      placeholder: 'Ej: AM5' },
    { key: 'chipset',    label: 'Chipset',      placeholder: 'Ej: X670E' },
    { key: 'formato',    label: 'Formato',     placeholder: 'Ej: ATX' },
    { key: 'slotsRam',   label: 'Slots RAM',   placeholder: 'Ej: 4x DDR5' },
  ],
  Mouse: [
    { key: 'dpi',        label: 'DPI Máx',     placeholder: 'Ej: 25600 DPI' },
    { key: 'botones',    label: 'Botones',     placeholder: 'Ej: 7 botones' },
    { key: 'conexion',   label: 'Conexión',    placeholder: 'Ej: USB / Wireless' },
    { key: 'rgb',        label: 'RGB',         placeholder: 'Ej: Sí / No' },
  ],
  Teclado: [
    { key: 'switch',     label: 'Switch',      placeholder: 'Ej: Cherry MX Red' },
    { key: 'layout',     label: 'Layout',      placeholder: 'Ej: TKL / Full Size' },
    { key: 'conexion',   label: 'Conexión',    placeholder: 'Ej: USB-C / Bluetooth' },
    { key: 'retroiluminacion', label: 'RGB',   placeholder: 'Ej: Per-key RGB' },
  ],
  Monitor: [
    { key: 'tamaño',     label: 'Tamaño',      placeholder: 'Ej: 27"' },
    { key: 'resolucion', label: 'Resolución',  placeholder: 'Ej: 2560x1440' },
    { key: 'hz',         label: 'Refresh Rate',placeholder: 'Ej: 165Hz' },
    { key: 'panel',      label: 'Panel',       placeholder: 'Ej: IPS / VA / TN' },
  ],
  Auriculares: [
    { key: 'tipo',       label: 'Tipo',        placeholder: 'Ej: Over-ear / In-ear' },
    { key: 'conexion',   label: 'Conexión',    placeholder: 'Ej: USB / 3.5mm' },
    { key: 'microfono',  label: 'Micrófono',   placeholder: 'Ej: Sí, desmontable' },
    { key: 'frecuencia', label: 'Resp. Frec.', placeholder: 'Ej: 20Hz - 20kHz' },
  ],
  Procesador: [
    { key: 'nucleos',    label: 'Núcleos',     placeholder: 'Ej: 16C / 32T' },
    { key: 'frecuencia', label: 'Frecuencia',  placeholder: 'Ej: 5.8GHz boost' },
    { key: 'socket',     label: 'Socket',      placeholder: 'Ej: LGA1700' },
    { key: 'tdp',        label: 'TDP',         placeholder: 'Ej: 125W' },
  ],
  RAM: [
    { key: 'capacidad',  label: 'Capacidad',   placeholder: 'Ej: 32GB (2x16GB)' },
    { key: 'tipo',       label: 'Tipo',        placeholder: 'Ej: DDR5' },
    { key: 'velocidad',  label: 'Velocidad',   placeholder: 'Ej: 6000MHz CL36' },
    { key: 'rgb',        label: 'RGB',         placeholder: 'Ej: Sí / No' },
  ],
};

const CATEGORIAS = Object.keys(SPECS_POR_CATEGORIA);

// ── Componente principal ──────────────────────────────────────────────────
function ProductForm() {
  // Estados formulario
  const [nombre,       setNombre]       = useState('');
  const [precio,       setPrecio]       = useState('');
  const [categoria,    setCategoria]    = useState('');
  const [stock,        setStock]        = useState('');
  const [imagen,       setImagen]       = useState(null);
  const [visualizacion,setVisualizacion]= useState('');
  const [specs,        setSpecs]        = useState({});
  const [errores,      setErrores]      = useState({});
  const [productos,    setProductos]    = useState([]);

  // Actualizar un campo de specs dinámico
  const handleSpec = (key, value) => {
    setSpecs(prev => ({ ...prev, [key]: value }));
  };

  // Cambiar categoría limpia las specs anteriores
  const handleCategoria = (valor) => {
    setCategoria(valor);
    setSpecs({});
  };

  // ── Validación ──────────────────────────────────────────────────────────
  const validarFormulario = () => {
    const e = {};

    if (nombre.trim() === '')       e.nombre    = 'El nombre es obligatorio';
    if (precio === '')              e.precio    = 'El precio es obligatorio';
    else if (Number(precio) <= 0)   e.precio    = 'El precio debe ser mayor a 0';
    if (categoria === '')           e.categoria = 'Selecciona una categoría';
    if (stock === '')               e.stock     = 'El stock es obligatorio';
    else if (Number(stock) < 0)     e.stock     = 'El stock debe ser >= 0';
    if (!imagen)                    e.imagen    = 'Selecciona una imagen';

    // Validar specs del panel 2
    if (categoria && SPECS_POR_CATEGORIA[categoria]) {
      SPECS_POR_CATEGORIA[categoria].forEach(({ key, label }) => {
        if (!specs[key] || specs[key].trim() === '') {
          e[`spec_${key}`] = `${label} es obligatorio`;
        }
      });
    }

    setErrores(e);
    return Object.keys(e).length === 0;
  };

  // ── Imagen con límite 2MB ───────────────────────────────────────────────
  const verImagen = (e) => {
    const archivo = e.target.files[0];
    if (!archivo) return;
    if (archivo.size / 1024 / 1024 > 2) {
      e.target.value = '';
      setImagen(null);
      setVisualizacion('');
      setErrores(prev => ({ ...prev, imagen: 'La imagen supera el límite de 2MB' }));
      return;
    }
    setErrores(prev => ({ ...prev, imagen: undefined }));
    setImagen(archivo);
    setVisualizacion(URL.createObjectURL(archivo));
  };

  // ── Guardar ─────────────────────────────────────────────────────────────
  const guardarProducto = (e) => {
    e.preventDefault();
    if (!validarFormulario()) return;

    setProductos(prev => [...prev, {
      nombre, precio: Number(precio), categoria,
      stock: Number(stock), visualizacion, specs: { ...specs }
    }]);

    // Reset
    setNombre(''); setPrecio(''); setCategoria('');
    setStock(''); setImagen(null); setVisualizacion('');
    setSpecs({}); setErrores({});
  };

  // ── Eliminar con confirmación ───────────────────────────────────────────
  const eliminarProducto = (index) => {
    if (window.confirm('¿Eliminar este producto?')) {
      setProductos(prev => prev.filter((_, i) => i !== index));
    }
  };

  // ── Estadísticas para Panel 3 ───────────────────────────────────────────
  const totalStock    = productos.reduce((acc, p) => acc + p.stock, 0);
  const totalValor    = productos.reduce((acc, p) => acc + p.precio * p.stock, 0);
  const porCategoria  = productos.reduce((acc, p) => {
    acc[p.categoria] = (acc[p.categoria] || 0) + 1;
    return acc;
  }, {});

  const camposActuales = categoria ? SPECS_POR_CATEGORIA[categoria] : null;

  // ── Render ──────────────────────────────────────────────────────────────
  return (
    <div className="app-layout">

      {/* ══ HEADER ══════════════════════════════════════════════════════════ */}
      <header className="app-header">
        <span className="header-logo">▶</span>
        <h1>TECH STORE</h1>
        <span className="header-badge">8-BIT INVENTORY</span>
      </header>

      {/* ══ GRID DE PANELES ═════════════════════════════════════════════════ */}
      <div className="paneles-grid">

        {/* ── PANEL 1: Datos básicos ──────────────────────────────────────── */}
        <section className="panel panel-form">
          <div className="panel-title">
            <span className="panel-icon">①</span> DATOS DEL PRODUCTO
          </div>
          <form onSubmit={guardarProducto}>

            <label>Nombre</label>
            <input
              type="text"
              placeholder="Ej: RTX 5090 Founders Edition"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
            />
            {errores.nombre && <p className="error">{errores.nombre}</p>}

            <label>Categoría</label>
            <select value={categoria} onChange={(e) => handleCategoria(e.target.value)}>
              <option value="">-- SELECCIONAR --</option>
              {CATEGORIAS.map(cat => (
                <option key={cat} value={cat}>{cat.toUpperCase()}</option>
              ))}
            </select>
            {errores.categoria && <p className="error">{errores.categoria}</p>}

            <label>Imagen del producto</label>
            <div className="file-drop">
              <input type="file" accept="image/*" onChange={verImagen} />
            </div>
            {errores.imagen && <p className="error">{errores.imagen}</p>}
            {visualizacion && (
              <>
                <p className="preview-titulo">Vista previa</p>
                <img src={visualizacion} alt="preview" className="visualizacion" />
              </>
            )}

            <div className="fila-dos">
              <div className="campo">
                <label>Precio ($)</label>
                <input
                  type="number"
                  placeholder="Ej: 899990"
                  value={precio}
                  onChange={(e) => setPrecio(e.target.value)}
                />
                {errores.precio && <p className="error">{errores.precio}</p>}
              </div>
              <div className="campo">
                <label>Stock</label>
                <input
                  type="number"
                  placeholder="Ej: 10"
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                />
                {errores.stock && <p className="error">{errores.stock}</p>}
              </div>
            </div>

            <button type="submit">▶ GUARDAR PRODUCTO</button>
          </form>
        </section>

        {/* ── PANEL 2: Especificaciones técnicas (dinámico) ───────────────── */}
        <section className="panel panel-specs">
          <div className="panel-title">
            <span className="panel-icon">②</span> ESPECIFICACIONES
          </div>

          {!categoria ? (
            <div className="specs-empty">
              <p className="specs-hint">◀ SELECCIONA</p>
              <p className="specs-hint">UNA CATEGORÍA</p>
              <p className="specs-hint">PARA VER LAS</p>
              <p className="specs-hint">SPECS</p>
            </div>
          ) : (
            <>
              <div className="specs-categoria-badge">{categoria.toUpperCase()}</div>
              {camposActuales.map(({ key, label, placeholder }) => (
                <div key={key}>
                  <label>{label}</label>
                  <input
                    type="text"
                    placeholder={placeholder}
                    value={specs[key] || ''}
                    onChange={(e) => handleSpec(key, e.target.value)}
                  />
                  {errores[`spec_${key}`] && (
                    <p className="error">{errores[`spec_${key}`]}</p>
                  )}
                </div>
              ))}
            </>
          )}
        </section>

        {/* ── PANEL 3: Dashboard / Estadísticas ──────────────────────────── */}
        <section className="panel panel-stats">
          <div className="panel-title">
            <span className="panel-icon">③</span> INVENTARIO
          </div>

          <div className="stat-card">
            <span className="stat-label">PRODUCTOS</span>
            <span className="stat-value accent">{productos.length}</span>
          </div>

          <div className="stat-card">
            <span className="stat-label">STOCK TOTAL</span>
            <span className="stat-value">{totalStock} <span className="stat-unit">UND</span></span>
          </div>

          <div className="stat-card">
            <span className="stat-label">VALOR TOTAL</span>
            <span className="stat-value small">${totalValor.toLocaleString('es-CL')}</span>
          </div>

          <div className="stats-divider" />

          <p className="stats-section-title">POR CATEGORÍA</p>
          {CATEGORIAS.filter(cat => porCategoria[cat]).map(cat => (
            <div key={cat} className="stat-row">
              <span className="stat-row-label">{cat.toUpperCase()}</span>
              <span className="stat-row-val">{porCategoria[cat]}</span>
            </div>
          ))}
          {Object.keys(porCategoria).length === 0 && (
            <p className="specs-hint">SIN DATOS AÚN</p>
          )}
        </section>

      </div>{/* fin paneles-grid */}

      {/* ══ PANEL 4: Lista de productos ═════════════════════════════════════ */}
      <section className="panel panel-lista">
        <div className="panel-title">
          <span className="panel-icon">④</span>
          PRODUCTOS REGISTRADOS
          <span className="badge">{productos.length}</span>
        </div>

        {productos.length === 0 ? (
          <p className="specs-hint">NO HAY PRODUCTOS REGISTRADOS</p>
        ) : (
          <div className="lista-productos">
            {productos.map((p, index) => (
              <div className="card" key={index}>
                <img src={p.visualizacion} alt={p.nombre} />
                <div className="card-body">
                  <span className="categoria-tag">{p.categoria.toUpperCase()}</span>
                  <h3>{p.nombre}</h3>

                  {/* Specs resumidas */}
                  <div className="card-specs">
                    {Object.entries(p.specs).slice(0, 3).map(([key, val]) => (
                      <p key={key} className="card-spec-row">
                        <span className="spec-key">
                          {SPECS_POR_CATEGORIA[p.categoria]?.find(s => s.key === key)?.label || key}:
                        </span>{' '}
                        {val}
                      </p>
                    ))}
                  </div>

                  <div className="card-meta">
                    <span className="precio-tag">${p.precio.toLocaleString('es-CL')}</span>
                    <span className="stock-tag">STOCK: {p.stock}</span>
                  </div>
                  <button className="btn-eliminar" onClick={() => eliminarProducto(index)}>
                    ✕ ELIMINAR
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

    </div>
  );
}

export default ProductForm;