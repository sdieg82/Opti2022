import React,{useState} from 'react';
import Layout from '../components/Layout'
import { useFormik } from 'formik';
import * as Yup from 'yup'
import {gql, useMutation} from '@apollo/client' 
import Swal from 'sweetalert2'
import { useRouter } from 'next/router'
import Select from 'react-select'
import Proveedor from '../components/Proveedor';

const NUEVO_PRODUCTO = gql`
    mutation nuevoProducto($input: ProductoInput) {
        nuevoProducto(input: $input) {
            id
            marca
            modelo
            nombreProveedor
            nombre
            existencia
            precio    
        }
    }
`;

const OBTENER_PRODUCTOS = gql`
  query obtenerProductos {
      obtenerProductos {
          id
          marca
          modelo
          nombreProveedor
          nombre 
          precio
          existencia
      }
  }
`;



const OBTENER_PROVEEDORES = gql`
    query obtenerProveedores {
        obtenerProveedores {
            id  
            nombre
            apellido
            direccion
            cedula
            email
            telefono
          }
    }

`;

const NuevoProducto = () => {

    // routing
    const router = useRouter();

     // Mensaje de alerta
     const [mensaje, guardarMensaje] = useState(null);
     
    // Mutation de apollo
    const [nuevoProducto] = useMutation(NUEVO_PRODUCTO, {
        update(cache, { data: { nuevoProducto } }) {
            // obtener el objeto de cache
            const { obtenerProductos } = cache.readQuery({ query: OBTENER_PRODUCTOS });
           
            // reescribir ese objeto
            cache.writeQuery({
                query: OBTENER_PRODUCTOS,
                data: {
                    obtenerProductos: [...obtenerProductos,nuevoProducto]
                }
            });
        }
    });

  
    // Formulario para nuevos productos
    const formik = useFormik({
        initialValues: {
            marca:'',
            modelo:'',
            nombreProveedor:'',
            nombre: '',
            existencia: '',
            precio: '',
            
            
        },
        validationSchema: Yup.object({
            marca: Yup.string() 
                        .required('La marca del producto es obligatorio'),
            modelo: Yup.string() 
                        .required('El modelo del producto es obligatorio'),  
            nombreProveedor: Yup.string(),
                        // .required('El nombre del Proveedor es obligatorio')
                        // .matches(/^[aA-zZ-á-é-í-ó-ú-Á-É-Í-Ó-Ú\s]+$/, "Ingrese solo letras "), 
            nombre: Yup.string() 
                        .required('El nombre del producto es obligatorio')
                        .matches(/^[aA-zZ-á-é-í-ó-ú-Á-É-Í-Ó-Ú\s]+$/, "Ingrese solo letras "),
            // marca: Yup.string() 
            //             .required('La marca del producto es obligatorio')
            //             .matches(/^[aA-zZ\s]+$/, "Ingrese solo letras "),

            existencia: Yup.number()
                        .required('Agrega la cantidad disponible')
                        .positive('No se aceptan números negativos')
                        .integer('La existencia deben ser números enteros'),
            precio: Yup.number()
                        .required('El precio es obligatorio')
                        .positive('No se aceptan números negativos'),
            
                        
         
        }), 
        onSubmit: async valores => {

            const {marca, nombre,existencia, precio,modelo,nombreProveedor} = valores;

            try {
                const { data } = await nuevoProducto({
                    variables: {
                        input: {
                            marca,
                            modelo,
                            nombreProveedor,
                            nombre,
                            // marca,
                            existencia,
                            precio
                           
                        
                            
                        }
                    }
                });

                // console.log(data);

                // Mostrar una alerta
                Swal.fire(
                    'Creado',
                    'Se creó el producto correctamente',
                    'success'
                )

                // Redireccionar hacia los productos
                router.push('/productos'); 
            } catch (error) {
                guardarMensaje(error.message.replace('GraphQL error: ', ''));

                setTimeout(() => {
                    guardarMensaje(null);
                }, 2000);
            }
        }
    })

    const mostrarMensaje = () => {
        return(
            <div className="bg-white py-2 px-3 w-full my-3 max-w-sm text-center mx-auto">
                <p>{mensaje}</p>
            </div>
        )
    }
    const seleccionarProveedor = proveedores => {
        setCliente(proveedores);
    }

    return ( 
        <Layout>
            <h1 className="text-2xl text-gray-800 font-light">Crear Nuevo Producto</h1>
            {mensaje && mostrarMensaje() }
            <div className="flex justify-center mt-5">
                <div className="w-full max-w-lg">
                    <form
                        className="bg-white shadow-md px-8 pt-6 pb-8 mb-4"
                        onSubmit={formik.handleSubmit}
                    >
                             <p className="mt-10 my-2 bg-white border-l-4 border-gray-800 text-gray-700 p-2 text-sm font-bold">1.- Asigna un proveedor para la compra</p>
                            <Select
                                className="mt-3"
                                // options={ obtenerProveedores}
                                onChange={ opcion => seleccionarProveedor(opcion) }
                                getOptionValue={ opciones => opciones.id }
                                getOptionLabel={ opciones => opciones.nombre+'  '+opciones.apellido}
                                placeholder="Busque o Seleccione el Proveedor"
                                noOptionsMessage={() => "No hay resultados"}
                         />
                            {/* <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="nombreProveedor">
                                    Nombre del Proveedor
                                </label>

                                <input
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    id="nombreProveedor"
                                    type="text"
                                    placeholder="Nombre del Proveedor"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.nombreProveedor}
                                />
                            </div>

                            { formik.touched.nombreProveedor && formik.errors.nombreProveedor ? (
                                <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4" >
                                    <p className="font-bold">Error</p>
                                    <p>{formik.errors.nombreProveedor}</p>
                                </div>
                            ) : null  } */}

                        <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2 p-2" htmlFor="marca">
                                    Marca del Producto
                                </label>

                                <input
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    id="marca"
                                    type="text"
                                    placeholder="Marca del producto"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.marca}
                                />
                            </div>

                            { formik.touched.marca && formik.errors.marca ? (
                                <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4" >
                                    <p className="font-bold">Error</p>
                                    <p>{formik.errors.marca}</p>
                                </div>
                            ) : null  }

                        <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="modelo">
                                    Modelo del Producto
                                </label>

                                <input
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    id="modelo"
                                    type="text"
                                    placeholder="Modelo del producto"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.modelo}
                                />
                            </div>

                            { formik.touched.modelo && formik.errors.modelo ? (
                                <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4" >
                                    <p className="font-bold">Error</p>
                                    <p>{formik.errors.modelo}</p>
                                </div>
                            ) : null  }
                            
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="nombre">
                                    Tipo del Producto
                                </label>

                                <input
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    id="nombre"
                                    type="text"
                                    placeholder="Tipo del Producto"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.nombre}
                                />
                            </div>

                            { formik.touched.nombre && formik.errors.nombre ? (
                                <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4" >
                                    <p className="font-bold">Error</p>
                                    <p>{formik.errors.nombre}</p>
                                </div>
                            ) : null  }

                             {/* <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="marca">
                                    Marca del Producto
                                </label>

                                <input
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    id="marca"
                                    type="text"
                                    placeholder="Marca Producto"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.marca}
                                />
                            </div>

                            { formik.touched.marca && formik.errors.marca ? (
                                <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4" >
                                    <p className="font-bold">Error</p>
                                    <p>{formik.errors.marca}</p>
                                </div>
                            ) : null  } */}

                        

                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="existencia">
                                    Cantidad Disponible
                                </label>

                                <input
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    id="existencia"
                                    type="number"
                                    placeholder="Cantidad Disponible"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.existencia}
                                />
                            </div>

                            { formik.touched.existencia && formik.errors.existencia ? (
                                <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4" >
                                    <p className="font-bold">Error</p>
                                    <p>{formik.errors.existencia}</p>
                                </div>
                            ) : null  }

                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="precio">
                                    Precio
                                </label>

                                <input
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    id="precio"
                                    type="number"
                                    placeholder="Precio Producto"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.precio}
                                />
                            </div>

                            { formik.touched.precio && formik.errors.precio ? (
                                <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4" >
                                    <p className="font-bold">Error</p>
                                    <p>{formik.errors.precio}</p>
                                </div>
                            ) : null  }

                
                        

                            <input
                                type="submit"
                                className="bg-gray-800 w-full mt-5 p-2 text-white uppercase font-bold hover:bg-gray-900"
                                value="Agregar Nuevo Producto"
                            />
                    </form>
                </div>
            </div>
        </Layout>
     );
}
 
export default NuevoProducto;