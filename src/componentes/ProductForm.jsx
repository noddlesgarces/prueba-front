import { useState } from 'react';

// Componente principal del formulario de productos tecnológicos
function ProductForm() {
    // ── Estados del formulario ──────────────────────────────────────────────
    const [nombre, setNombre]           = useState('');
    const [precio, setPrecio]           = useState('');
    const [categoria, setCategoria]     = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [stock, setStock]             = useState('');
    const [imagen, setImagen]           = useState(null);
    const [visualizacion, setVisualizacion] = useState('');
    const [errores, setErrores]         = useState({});
    const [productos, setProductos]     = useState([]);

    // ── Validación del formulario ───────────────────────────────────────────
    const validarFormulario = () => {
        let nuevosErrores = {};

        // Validar nombre
        if (nombre.trim() === '') {
            nuevosErrores.nombre = 'El nombre es obligatorio';
        }

        // Validar precio
        if (precio === '') {
            nuevosErrores.precio = 'El precio es obligatorio';
        } else if (Number(precio) <= 0) {
            nuevosErrores.precio = 'El precio debe ser mayor a 0';
        }

        // Validar categoría
        if (categoria === '') {
            nuevosErrores.categoria = 'Debe seleccionar una categoría';
        }

        // Validar descripción (requerida, textarea)
        if (descripcion.trim() === '') {
            nuevosErrores.descripcion = 'La descripción es obligatoria';
        }

        // Validar stock (requerido y >= 0)
        if (stock === '') {
            nuevosErrores.stock = 'El stock es obligatorio';
        } else if (Number(stock) < 0) {
            nuevosErrores.stock = 'El stock debe ser mayor o igual a 0';
        }

        // Validar imagen
        if (!imagen) {
            nuevosErrores.imagen = 'Debe seleccionar una imagen';
        }

        setErrores(nuevosErrores);
        return Object.keys(nuevosErrores).length === 0;
    };

    // ── Manejo de imagen con validación de tamaño (máx 2MB) ────────────────
    const verImagen = (e) => {
        const archivo = e.target.files[0];
        if (!archivo) return;

        const LIMITE_MB = 2;
        const tamañoMB = archivo.size / (1024 * 1024);

        if (tamañoMB > LIMITE_MB) {
            // Limpiar selección y mostrar error inmediato
            e.target.value = '';
            setImagen(null);
            setVisualizacion('');
            setErrores(prev => ({
                ...prev,
                imagen: `La imagen supera el tamaño permitido de ${LIMITE_MB}MB`
            }));
            return;
        }

        // Imagen válida: limpiar error y guardar
        setErrores(prev => ({ ...prev, imagen: undefined }));
        setImagen(archivo);
        setVisualizacion(URL.createObjectURL(archivo));
    };

    // ── Guardar producto ────────────────────────────────────────────────────
    const guardarProducto = (e) => {
        e.preventDefault();
        if (validarFormulario()) {
            const nuevoProducto = {
                nombre,
                precio,
                categoria,
                descripcion,
                stock,
                visualizacion
            };
            setProductos([...productos, nuevoProducto]);

            // Limpiar formulario
            setNombre('');
            setPrecio('');
            setCategoria('');
            setDescripcion('');
            setStock('');
            setImagen(null);
            setVisualizacion('');
            setErrores({});
        }
    };

    // ── Eliminar producto con confirmación ──────────────────────────────────
    const eliminarProducto = (index) => {
        const confirmar = window.confirm('¿Estás seguro de que deseas eliminar este producto?');
        if (confirmar) {
            setProductos(productos.filter((_, i) => i !== index));
        }
    };

    // ── Render ──────────────────────────────────────────────────────────────
    return (
        <div className="contenedor">
            <h1>Productos Tecnológicos</h1>

            <form onSubmit={guardarProducto}>

                {/* Campo: Nombre */}
                <label>Nombre del producto</label>
                <input
                    type="text"
                    placeholder="Ej: Notebook Lenovo IdeaPad"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                />
                {errores.nombre && <p className="error">{errores.nombre}</p>}

                {/* Campo: Descripción (textarea) */}
                <label>Descripción</label>
                <textarea
                    placeholder="Describe las características del producto..."
                    value={descripcion}
                    onChange={(e) => setDescripcion(e.target.value)}
                />
                {errores.descripcion && <p className="error">{errores.descripcion}</p>}

                {/* Campo: Precio */}
                <label>Precio</label>
                <input
                    type="number"
                    placeholder="Ej: 499990"
                    value={precio}
                    onChange={(e) => setPrecio(e.target.value)}
                />
                {errores.precio && <p className="error">{errores.precio}</p>}

                {/* Campo: Stock */}
                <label>Stock</label>
                <input
                    type="number"
                    placeholder="Ej: 15"
                    value={stock}
                    onChange={(e) => setStock(e.target.value)}
                />
                {errores.stock && <p className="error">{errores.stock}</p>}

                {/* Campo: Categoría */}
                <label>Categoría</label>
                <select
                    value={categoria}
                    onChange={(e) => setCategoria(e.target.value)}
                >
                    <option value="">Seleccione</option>
                    <option value="Notebook">Notebook</option>
                    <option value="MotherBoard">MotherBoard</option>
                    <option value="Tarjeta gráfica">Tarjeta Gráfica RTX 5090</option>
                </select>
                {errores.categoria && <p className="error">{errores.categoria}</p>}

                {/* Campo: Imagen con validación de 2MB */}
                <label>Imagen del producto</label>
                <input
                    type="file"
                    accept="image/*"
                    onChange={verImagen}
                />
                {errores.imagen && <p className="error">{errores.imagen}</p>}

                {/* Vista previa de imagen */}
                {visualizacion && (
                    <div>
                        <h3 className="preview-titulo">Vista Previa</h3>
                        <img src={visualizacion} alt="previsualización" className="visualizacion" />
                    </div>
                )}

                <button type="submit">Guardar Producto</button>
            </form>

            <hr />

            {/* Contador dinámico de productos */}
            <h2>
                Productos Registrados{' '}
                <span className="badge">{productos.length}</span>
            </h2>

            {/* Lista de tarjetas de productos */}
            <div className="lista-productos">
                {productos.map((producto, index) => (
                    <div className="card" key={index}>
                        <img src={producto.visualizacion} alt={producto.nombre} />
                        <h3>{producto.nombre}</h3>
                        <p className="card-descripcion">{producto.descripcion}</p>
                        <p><strong>Precio:</strong> ${Number(producto.precio).toLocaleString('es-CL')}</p>
                        <p><strong>Categoría:</strong> {producto.categoria}</p>
                        <p><strong>Stock:</strong> {producto.stock} unidades</p>
                        <button onClick={() => eliminarProducto(index)}>Eliminar</button>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default ProductForm;