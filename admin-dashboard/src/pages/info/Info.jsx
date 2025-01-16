import {  useEffect } from "react";
import { useForm } from "react-hook-form";
import { CardAction, CardFooter, PrimaryButton } from "../../components/ui";
import { useFetchGet} from '../../hooks/fetcher';
import { fetchPost } from "../../services/fetchPost";
import { displayResponseMessages } from "../../lib/utils";

export function Info() {
const endpoint = "infosite";
const {data:siteInfo, error} = useFetchGet(endpoint);
const { register, handleSubmit, setValue, setError, formState: { errors, isSubmitting } } = useForm();

useEffect(() => {
  if (siteInfo) {
    setValue( "domain", siteInfo.domain);
    setValue( "email", siteInfo.email); 
    setValue( "address", siteInfo.address); 
    setValue( "phone_number", siteInfo.phone_number); 
    setValue( "whatsapp_number", siteInfo.whatsapp_number); 
    setValue( "whatsapp_message", siteInfo.whatsapp_message); 
  }
}, [siteInfo]);

const onSubmit = async (data) => {
  let method = "POST";
  if(siteInfo) {
    method = "PUT";
  }

  const response = await fetchPost(endpoint, data, method);
  displayResponseMessages(response, data, setError);
}


return (
  <div>

    <h1 className="text-3xl font-medium mb-10">Datos públicos del negocio</h1>
    <form className="max-w-sm" onSubmit={handleSubmit(onSubmit)} >
    <CardAction extraClass="gap-4">

      <div>
        <label htmlFor="domain" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Dominio web</label>
        {errors.domain && <p className="text-red-800 font-medium">{errors.domain.message}</p>}
          
          <input
          type="url" 
          id="domain"
          className="rounded-lg bg-gray-50 border text-gray-900 focus:ring-blue-500 focus:border-blue-500 block flex-1 min-w-0 w-full text-sm border-gray-300 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          {...register("domain")}
          />
        </div>

        <div>
          <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Email</label>
          {errors.email && <p className="text-red-800 font-medium">{errors.email.message}</p>}
          
          <input
          type="email"
          id="email" 
          className="rounded-lg bg-gray-50 border text-gray-900 focus:ring-blue-500 focus:border-blue-500 block flex-1 min-w-0 w-full text-sm border-gray-300 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          {...register("email")}
          />
        </div>

        <div>
          <label htmlFor="address" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Ubicación</label>
          {errors.address && <p className="text-red-800 font-medium">{errors.address.message}</p>}
          
          <input
          type="text"
          id="address" 
          className="rounded-lg bg-gray-50 border text-gray-900 focus:ring-blue-500 focus:border-blue-500 block flex-1 min-w-0 w-full text-sm border-gray-300 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          {...register("address")}
          />
        </div>

        <div>
          <label htmlFor="phone_number" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Telefono</label>
          {errors.phone_number && <p className="text-red-800 font-medium">{errors.phone_number.message}</p>}
          
          <input
          type="tel"
          id="phone_number" 
          className="rounded-lg bg-gray-50 border text-gray-900 focus:ring-blue-500 focus:border-blue-500 block flex-1 min-w-0 w-full text-sm border-gray-300 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          {...register("phone_number")}
          />
        </div>


        <div>
          <label htmlFor="whatsapp_number" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Numero de Whatsapp</label>
          {errors.whatsapp_number && <p className="text-red-800 font-medium">{errors.whatsapp_number.message}</p>}
          
          <input
          type="tel"
          id="whatsapp_number" 
          className="rounded-lg bg-gray-50 border text-gray-900 focus:ring-blue-500 focus:border-blue-500 block flex-1 min-w-0 w-full text-sm border-gray-300 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          {...register("whatsapp_number")}
          />
        </div>



        <div>
          <label htmlFor="whatsapp_number" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Mensaje de Whatsapp</label>
          {errors.whatsapp_message && <p className="text-red-800 font-medium">{errors.whatsapp_message.message}</p>}
          
          <textarea
          rows={3}
          cols={30}
          id="whatsapp_message" 
          className="rounded-lg bg-gray-50 border text-gray-900 focus:ring-blue-500 focus:border-blue-500 block flex-1 min-w-0 w-full text-sm border-gray-300 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          {...register("whatsapp_message")}
          ></textarea>
        </div>

        <CardFooter>
            <PrimaryButton
            isDisabled={isSubmitting}
            
            >{siteInfo ? 'Actualizar Datos' : 'Guardar Datos'}</PrimaryButton>
        </CardFooter>

      </CardAction>
      </form>

    </div>
  )
}
