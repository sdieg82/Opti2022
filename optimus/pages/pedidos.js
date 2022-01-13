import Layout from '../components/Layout';

import Link from 'next/link';
import { gql, useQuery } from '@apollo/client'
import Pedido from '../components/Pedido';
import dateFilter from '../components/dateFilter';
import 'react-datepicker/dist/react-datepicker.css';



const OBTENER_PEDIDOS = gql`
  query obtenerPedidosVendedor {
      obtenerPedidosVendedor {
        id
        pedido {
          id
          cantidad
          nombre
        }
        cliente {
          id
          nombre
          cedula
          apellido
          email
          telefono
        }
        vendedor
        total
        estado
        creado
      }
  }
`


const Pedidos = () => {
    
  
    
    const{data,loading,error}=useQuery(OBTENER_PEDIDOS)
   
    if(loading) return 'Cargando...'
    
    const{obtenerPedidosVendedor}=data;
   
 
    return(
     
      
    <Layout>
      
    
   
    <div className={"border-t-4 mt-4 bg-white rounded p-2 md:grid md:grid-cols-2 md:gap-4 shadow-lg"}>
    <h1 className="text-2xl text-gray-800 font-light">Pedidos</h1>
    <div>
    <dateFilter> 
      
    </dateFilter>
   
    
    {/* <button 
                onClick={() => cerrarSesion() }
                type="button"
               
                className="bg-blue-800 w-full w-1/2 font-bold uppercase text-xs rounded py-1 px-2 text-white shadow-md"    
            >
                Cerrar Sesión
            </button> */}
    </div>
    </div>
    <Link href="/nuevopedido">
            <a className="bg-blue-800 py-2 px-5 mt-3 inline-block text-white rounded text-sm hover:bg-gray-800 mb-3 uppercase font-bold">Nuevo Pedido</a>
          
     </Link>

     
     
     { obtenerPedidosVendedor?.length === 0 ? (
            <p className="mt-5 text-center text-2xl">No hay pedidos aún</p>
          ) : (
            obtenerPedidosVendedor?.map( pedido => (
                <Pedido 
                  key={pedido.id}
                  pedido={pedido}
                />
            ))  
          )}
    </Layout>
    
    )
}
 
export default Pedidos;