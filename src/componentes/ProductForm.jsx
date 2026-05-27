import { useState } from 'react';

function ProductForm() {
    const [nombre, setNombre] = useState('');
    const [precio, setPrecio] = useState('');
    const [categoria, setCategoria] = useState('');
    const [imagen, setImagen] = useState(null);
    const [visualizacion, setVisualizacion] = useState('');
    const [errores, setErrores] = useState({});
    const [productos, setProductos] = useState([]);
    const [descripcion, setDescripcion] = useState('');
    const [stock, setStock] = useState('');

    const validarFormulario = () => {

        let nuevosErrores = {};

        if (nombre.trim() === '') {
            nuevosErrores.nombre = 'El nombre es obligatorio';
        } if (precio === '') {

            nuevosErrores.precio = 'El precio es obligatorio';
        } else if (precio <= 0) {
            nuevosErrores.precio = 'El precio debe ser mayor a 0';
        }

        if (categoria === '') {
            nuevosErrores.categoria = 'Debe seleccionar una categoría';
        }

        if (!imagen) {
            nuevosErrores.imagen = 'Debe seleccionar una imagen';
        }

        setErrores(nuevosErrores);

        return Object.keys(nuevosErrores).length === 0;

    };
    const verImagen = (e) => {
        const archivo = e.target.files[0];
        if (archivo) {

            setImagen(archivo);
            setVisualizacion(URL.createObjectURL(archivo));

        }
    };

    const guardarProducto = (e) => {

        e.preventDefault();
        if (validarFormulario()) {
            const nuevoProducto =
            {
                nombre,
                precio,
                categoria,
                visualizacion,
                descripcion,
                stock
            };
            setProductos([...productos, nuevoProducto]);
            setNombre('');
            setPrecio('');
            setCategoria('');
            setImagen(null);
            setVisualizacion('');
            setErrores({});


        }

    };
    const eliminarProducto = (index) => {
        setProductos(productos.filter((_, i) => i !== index));
    };
    return (
        <div className='contenedor'>

            <h1>Productos Tecnológicos</h1>
            <form onSubmit={guardarProducto}>
                <label>Nombre del producto</label>
                <input type='text'
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}>
                </input>
                {errores.nombre && <p className='error'>{errores.nombre}</p>}

                <label>Precio</label>
                <input type='number' value={precio}
                    onChange={(e) => setPrecio(e.target.value)}>
                </input>
                {errores.precio && <p className='error'>{errores.precio}</p>}

                <label>Categoría</label>
                <select value={categoria}
                    onChange={(e) => setCategoria(e.target.value)}>
                    <option value="">Seleccione</option>
                    <option value="Notebook">Notebook</option>
                    <option value="MotherBoard">MotherBoard</option>
                    <option value="Tarjeta gráfica">Tarjeta Gráfica RTX 5090</option>
                </select>
                <label>Descripción</label>
                <input type='text' value={descripcion} onChange={(e) => setDescripcion(e.target.value)} />

                <label>Stock</label>
                <input type='number' value={stock} onChange={(e) => setStock(e.target.value)} />

                {errores.categoria && <p className='error'>{errores.categoria}</p>}

                <label>Imagen de los productos</label>
                <input type="file"
                    accept='image/*'
                    onChange={verImagen}></input>

                {errores.imagen && <p className='error'>{errores.imagen}</p>}

                {visualizacion && (
                    <div>
                        <h3>Vista Previa</h3>
                        <img src={visualizacion} alt="visualizacion" className='visualizacion'></img>
                    </div>
                )}
                <button type="submit">Guardar Producto</button>
            </form>

            <hr />
            <h2>Productos registrados <span className="badge">{productos.length}</span></h2>
            <div className='lista-productos'>
                {productos.map((productos, index) => (
                    <div className="card" key={index}>
                        <img src={productos.visualizacion}
                            alt={productos.nombre}>
                        </img>
                        <h3>{productos.nombre}</h3>
                        <p>Precio: ${productos.precio}</p>
                        <p>Categoria:{productos.categoria}</p>
                        <button onClick={() => eliminarProducto(index)}>Eliminar</button>
                    </div>

                ))}
            </div>

        </div>
    );
}
export default ProductForm