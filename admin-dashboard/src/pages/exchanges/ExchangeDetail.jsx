import { useEffect, useState } from "react";
import { useParams, NavLink, useNavigate } from "react-router";
import { useForm, Controller } from "react-hook-form";
import { useFetchGet} from '../../hooks/fetcher';
import { fetchPost } from "../../services/fetchPost";
import { CardAction, CardFooter, PrimaryButton } from "../../components/ui";
import { transformDate } from "../../lib/utils";
import AvatarCircle from "../../components/ui/AvatarCircle";
import { ToastContainer, toast } from 'react-toastify';
import {ModalDelete} from "../../components/ModalDelete";
import { ComeBackLink } from "../../components/ComeBackLink";
import { useMessageProvider } from "../../utils/MessageContext";

export  function ExchangeDetail() {
  const { id } = useParams();
  const {addMessage} = useMessageProvider();
  const [isPreselected, setIsPreselected] = useState(false);
  const [isUpdatingPreselected, setIsUpdatingPreselected] = useState(false);


  const endpoint = "exchangerates/" + id;
  const navigate = useNavigate();
  
  const {data:exchange, loading, error} = useFetchGet(endpoint)
  const { register, handleSubmit, setValue, control, formState: { errors, isSubmitting } } = useForm();
  
  // const handlePreselect

  useEffect(() => {
    if (exchange) {
      setValue( "base_amount", parseFloat(exchange.base_amount)); 
      setValue( "target_amount", parseFloat(exchange.target_amount));
      setIsPreselected(Boolean(exchange.is_default));
    }

  }, [exchange]);

  const handleChangePreselected = () => {
    if (!isPreselected) {
      if (!isUpdatingPreselected) {
        
        setIsPreselected(true);
        setIsUpdatingPreselected(true);

        fetch("/api/" + endpoint + "/choice", {
          method: "PUT"
        }).then((resp) => {
          if (!resp.ok) {
            throw new Error();
          }
          toast.success("Tipo de cambio elegido como primero");

        }).catch(err => toast.error("No fue posible elegir el tipo de cambio como primero"))
        .finally(setIsUpdatingPreselected(false))
      }
    }
    
  }

  const onSubmit = async (data) => {
    const response = await fetchPost(endpoint, data, "PUT");
    if (!response.errors) {
      addMessage("Cambio actualizado con exito!");
      navigate("../");
    }
  }

  const deleteExchange = async () => {
    try {
      const response = await fetch("/api/" + endpoint, {method: "DELETE"});
      if (!response.ok) {
        throw new Error();
      }

      addMessage("Cambio eliminado con exito!")

      navigate("../");
    } catch(err) {
      toast.error("No fue posible eliminar el tipo de cambio");
    }
  }

  if (loading) {
      return <div>Cargando...</div>;
  }
  if (error) {
      return <div>Error: {error}</div>;
  }

  return (
    <section>
      <ToastContainer />
      <ComeBackLink />
      
      <h1 className="text-3xl font-medium">Editando cambio {exchange?.name}</h1>

      <div className={`max-w-xl my-4 p-2 border border-gray-200 rounded dark:border-gray-700  ${isUpdatingPreselected ? 'bg-gray-300 dark:bg-gray-600' : ''}`}>
        <div className="flex items-center">
        <input id="bordered-checkbox-1" type="checkbox" checked={isPreselected} onChange={handleChangePreselected} disabled={isUpdatingPreselected}
        name="bordered-checkbox" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
        <label htmlFor="bordered-checkbox-1" className="w-full py-4 ms-2 font-medium text-gray-900 dark:text-gray-300">Primero en mostrar</label>
        </div>
        <p className="text-sm">
          {isPreselected ? 'Éste tipo de cambio será el primero que tus usuarios verán al entrar a la página' : 'Marca ésta casilla para elegir éste tipo de cambio como el primero en mostrar.'}
        </p>
      </div>
      
      <form className="max-w-xl" onSubmit={handleSubmit(onSubmit)} >
        {exchange &&
      <CardAction 
        extraClass={`items-center gap-4 p-6 ${isPreselected ? 'drop-shadow-md shadow-md shadow-indigo-600' : ''} `}>
        
              
              <div className="w-full flex flex-col sm:flex-row justify-between items-center gap-4">
                
                <div className="w-full">
                  <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Valor de Moneda Base</label>
                  {errors.base_amount && <p className="text-red-800 font-medium">{errors.base_amount.message}</p>}
                  <div className="flex">
                    <div className="flex gap-3  items-center p-3 text-sm text-gray-900 bg-gray-200 border rounded-e-0 border-gray-300 border-e-0 rounded-s-md dark:bg-gray-600 dark:text-gray-400 dark:border-gray-600">
                    <AvatarCircle image={exchange.base_image} />
                      {exchange.base_symbol}
                    </div>
                    <input 
                    type="number" step="0.000001"
                    // type="text" inputmode="numeric" pattern="\d*" 

                    
                    className="rounded-none rounded-e-lg bg-gray-50 border text-gray-900 focus:ring-blue-500 focus:border-blue-500 block flex-1 min-w-0 w-full text-sm border-gray-300 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    {...register("base_amount", 
                      {
                        min: {value: 1, message: "el valor debe ser postivo"},
                        max: {value: 999999999999, message: "el valor es demasiado alto"},
                        required: "Proporciona un monto para la moneda de base",
                      }
                    )}
                    />
                  </div>
                </div>


                <svg className="hidden sm:block mt-6" width="25" height="34" viewBox="0 0 25 34" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M18.3848 1.11463C18.1501 0.879909 17.8317 0.748047 17.4998 0.748047C17.1679 0.748047 16.8495 0.879909 16.6148 1.11463C16.3801 1.34934 16.2482 1.66769 16.2482 1.99963C16.2482 2.33157 16.3801 2.64991 16.6148 2.88463L20.7323 6.99963H1.24979C0.918273 6.99963 0.60033 7.13132 0.36591 7.36574C0.131489 7.60016 -0.000206828 7.91811 -0.000206828 8.24963C-0.000206828 8.58115 0.131489 8.89909 0.36591 9.13351C0.60033 9.36793 0.918273 9.49963 1.24979 9.49963H20.7323L16.6148 13.6146C16.4986 13.7308 16.4064 13.8688 16.3435 14.0207C16.2806 14.1725 16.2482 14.3353 16.2482 14.4996C16.2482 14.664 16.2806 14.8267 16.3435 14.9786C16.4064 15.1304 16.4986 15.2684 16.6148 15.3846C16.731 15.5008 16.869 15.593 17.0208 15.6559C17.1727 15.7188 17.3354 15.7512 17.4998 15.7512C17.6642 15.7512 17.8269 15.7188 17.9788 15.6559C18.1306 15.593 18.2686 15.5008 18.3848 15.3846L24.6348 9.13463C24.7512 9.01851 24.8436 8.88057 24.9066 8.72871C24.9696 8.57685 25.002 8.41404 25.002 8.24963C25.002 8.08521 24.9696 7.92241 24.9066 7.77054C24.8436 7.61868 24.7512 7.48074 24.6348 7.36463L18.3848 1.11463ZM8.38479 20.3846C8.50101 20.2684 8.5932 20.1304 8.6561 19.9786C8.719 19.8267 8.75137 19.664 8.75137 19.4996C8.75137 19.3353 8.719 19.1725 8.6561 19.0207C8.5932 18.8688 8.50101 18.7308 8.38479 18.6146C8.26857 18.4984 8.1306 18.4062 7.97875 18.3433C7.8269 18.2804 7.66415 18.248 7.49979 18.248C7.33543 18.248 7.17268 18.2804 7.02083 18.3433C6.86899 18.4062 6.73101 18.4984 6.61479 18.6146L0.364793 24.8646C0.248385 24.9807 0.156028 25.1187 0.0930119 25.2705C0.0299957 25.4224 -0.00244141 25.5852 -0.00244141 25.7496C-0.00244141 25.914 0.0299957 26.0768 0.0930119 26.2287C0.156028 26.3806 0.248385 26.5185 0.364793 26.6346L6.61479 32.8846C6.84951 33.1193 7.16785 33.2512 7.49979 33.2512C7.83173 33.2512 8.15008 33.1193 8.38479 32.8846C8.61951 32.6499 8.75137 32.3316 8.75137 31.9996C8.75137 31.6677 8.61951 31.3493 8.38479 31.1146L4.26729 26.9996H23.7498C24.0813 26.9996 24.3993 26.8679 24.6337 26.6335C24.8681 26.3991 24.9998 26.0811 24.9998 25.7496C24.9998 25.4181 24.8681 25.1002 24.6337 24.8657C24.3993 24.6313 24.0813 24.4996 23.7498 24.4996H4.26729L8.38479 20.3846Z" fill="currentColor"/>
                </svg>
                <svg className="block sm:hidden" width="30" height="26" viewBox="0 0 30 26" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M23.7124 25.1C23.5836 25.257 23.4215 25.3834 23.2378 25.4699C23.0541 25.5565 22.8534 25.6011 22.6504 25.6004C22.4738 25.6016 22.2987 25.5671 22.1357 25.499C21.9728 25.431 21.8252 25.3308 21.7018 25.2044L16.2946 19.79C16.0418 19.5369 15.8998 19.1938 15.8998 18.836C15.8998 18.4783 16.0418 18.1351 16.2946 17.882C16.5477 17.6292 16.8908 17.4872 17.2486 17.4872C17.6063 17.4872 17.9494 17.6292 18.2026 17.882L21.3004 20.9996V1.75042C21.3004 1.39238 21.4426 1.049 21.6958 0.795823C21.949 0.542649 22.2923 0.400418 22.6504 0.400418C23.0084 0.400418 23.3518 0.542649 23.605 0.795823C23.8581 1.049 24.0004 1.39238 24.0004 1.75042V20.9816L27.1 17.8892C27.353 17.637 27.6958 17.4953 28.0531 17.4953C28.4104 17.4953 28.7531 17.637 29.0062 17.8892C29.259 18.1423 29.401 18.4855 29.401 18.8432C29.401 19.201 29.259 19.5441 29.0062 19.7972L23.7124 25.1ZM8.41237 0.900818C8.28359 0.743818 8.12147 0.617457 7.93778 0.530904C7.75409 0.444352 7.55343 0.399778 7.35037 0.400418C7.17376 0.399285 6.99873 0.433768 6.83574 0.501808C6.67276 0.569848 6.52516 0.670047 6.40177 0.796418L0.996375 6.21082C0.743564 6.46394 0.601562 6.80707 0.601562 7.16482C0.601562 7.52257 0.743564 7.86569 0.996375 8.11882C1.2495 8.37163 1.59262 8.51363 1.95037 8.51363C2.30813 8.51363 2.65125 8.37163 2.90437 8.11882L6.00037 5.00302V24.2504C6.00037 24.6085 6.14261 24.9518 6.39578 25.205C6.64895 25.4582 6.99233 25.6004 7.35037 25.6004C7.70842 25.6004 8.05179 25.4582 8.30497 25.205C8.55814 24.9518 8.70037 24.6085 8.70037 24.2504V5.01922L11.8 8.11162C12.053 8.36388 12.3958 8.50553 12.7531 8.50553C13.1104 8.50553 13.4531 8.36388 13.7062 8.11162C13.959 7.85849 14.101 7.51537 14.101 7.15762C14.101 6.79987 13.959 6.45674 13.7062 6.20362L8.41237 0.900818Z" fill="currentColor"/>
                </svg>

                <div className="w-full">
                  <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Valor Moneda de Destino</label>
                  {errors.target_amount && <p className="text-red-800 font-medium">{errors.target_amount.message}</p>}
                  <div className="flex">
                    <div className="flex gap-3  items-center p-3 text-sm text-gray-900 bg-gray-200 border rounded-e-0 border-gray-300 border-e-0 rounded-s-md dark:bg-gray-600 dark:text-gray-400 dark:border-gray-600">
                    <AvatarCircle image={exchange.target_image} />
                      {exchange.target_symbol}
                    </div>
                    <input 
                    type="number" step="0.000001"
                    // type="text" inputmode="numeric" pattern="\d*" 
                    className="rounded-none rounded-e-lg bg-gray-50 border text-gray-900 focus:ring-blue-500 focus:border-blue-500 block flex-1 min-w-0 w-full text-sm border-gray-300 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    {...register("target_amount", 
                      {
                        min: {value: 1, message: "el valor debe ser postivo"},
                        max: {value: 999999999999, message: "el valor es demasiado alto"},
                        required: "Proporciona un monto para la moneda de destino",
                      }
                    )}
                    />
                  </div>
                </div>

              </div>
              <span className=" text-gray-500 dark:text-gray-400">Valor Actualizado el {transformDate(exchange.updated_at)}</span>
              <CardFooter>
                  <PrimaryButton
                    isDisabled={isSubmitting}
                  
                  >Guardar Cambio</PrimaryButton>
              </CardFooter>
          </CardAction>
          }

      </form>

      <div className="mt-12 w-full max-w-4xl flex flex-col sm:flex-row gap-4 justify-between items-center">
        <div className="w-full max-w-lg">
          <p className="text-lg mb-2  ">Eliminar Cambio</p>
          <p>Al eliminar el tipo de cambio éste desaparecerá de la página publica de tu sitio.</p>
        </div>

        <ModalDelete 
          isDisabled={isSubmitting}

        deleteButtonText="Eliminar Cambio"
        deleteCallback={deleteExchange}>
          <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">Estás seguro de que quieres eliminar este Tipo de Cambio?</h3>
        </ModalDelete>
      </div>

    </section>
  )
}
