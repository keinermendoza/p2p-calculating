import {  useEffect } from "react";
import { useForm } from "react-hook-form";
import { CardAction, CardFooter, PrimaryButton } from "../../components/ui";
import { useFetchGet} from '../../hooks/fetcher';
import { fetchPost } from "../../services/fetchPost";
import { displayResponseMessages } from "../../lib/utils";

export function Social() {
const endpoint = "socialaccounts";
const {data:socialAccounts, error} = useFetchGet(endpoint);
const { register, handleSubmit, setValue, setError, formState: { errors, isSubmitting } } = useForm();

useEffect(() => {
  if (socialAccounts) {
    setValue( "tiktok", socialAccounts.tiktok);
    setValue( "instagram", socialAccounts.instagram); 
    setValue( "facebook", socialAccounts.facebook); 
    setValue( "twitter", socialAccounts.twitter); 
    setValue( "threads", socialAccounts.threads); 
    setValue( "youtube", socialAccounts.youtube); 
  }
}, [socialAccounts]);


const onSubmit = async (data) => {
  let method = "POST";
  if(socialAccounts) {
    method = "PUT";
  }

  const response = await fetchPost(endpoint, data, method);
  displayResponseMessages(response, data, setError);

}

return (
  <div>

    <h1 className="text-3xl font-medium mb-10">Redes Sociales</h1>
    <form className="max-w-sm" onSubmit={handleSubmit(onSubmit)} >
    <CardAction extraClass="gap-4">

      <div>
        <label htmlFor="tiktok" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">TikTok</label>
        {errors.tiktok && <p className="text-red-800 font-medium">{errors.tiktok.message}</p>}
          
          <input
          type="url" 
          id="tiktok"
          className="rounded-lg bg-gray-50 border text-gray-900 focus:ring-blue-500 focus:border-blue-500 block flex-1 min-w-0 w-full text-sm border-gray-300 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          {...register("tiktok")}
          />
        </div>

        <div>
          <label htmlFor="instagram" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Instagram</label>
          {errors.instagram && <p className="text-red-800 font-medium">{errors.instagram.message}</p>}
          
          <input
          type="url"
          id="instagram" 
          className="rounded-lg bg-gray-50 border text-gray-900 focus:ring-blue-500 focus:border-blue-500 block flex-1 min-w-0 w-full text-sm border-gray-300 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          {...register("instagram")}
          />
        </div>

        <div>
          <label htmlFor="facebook" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Facebook</label>
          {errors.facebook && <p className="text-red-800 font-medium">{errors.facebook.message}</p>}
          
          <input
          type="url"
          id="facebook" 
          className="rounded-lg bg-gray-50 border text-gray-900 focus:ring-blue-500 focus:border-blue-500 block flex-1 min-w-0 w-full text-sm border-gray-300 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          {...register("facebook")}
          />
        </div>

        <div>
          <label htmlFor="twitter" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Twitter</label>
          {errors.twitter && <p className="text-red-800 font-medium">{errors.twitter.message}</p>}
          
          <input
          type="url"
          id="twitter" 
          className="rounded-lg bg-gray-50 border text-gray-900 focus:ring-blue-500 focus:border-blue-500 block flex-1 min-w-0 w-full text-sm border-gray-300 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          {...register("twitter")}
          />
        </div>


        <div>
          <label htmlFor="threads" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Threads</label>
          {errors.threads && <p className="text-red-800 font-medium">{errors.threads.message}</p>}
          
          <input
          type="url"
          id="threads" 
          className="rounded-lg bg-gray-50 border text-gray-900 focus:ring-blue-500 focus:border-blue-500 block flex-1 min-w-0 w-full text-sm border-gray-300 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          {...register("threads")}
          />
        </div>

        <div>
          <label htmlFor="youtube" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Youtube</label>
          {errors.youtube && <p className="text-red-800 font-medium">{errors.youtube.message}</p>}
          
          <input
          type="url"
          id="youtube" 
          className="rounded-lg bg-gray-50 border text-gray-900 focus:ring-blue-500 focus:border-blue-500 block flex-1 min-w-0 w-full text-sm border-gray-300 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          {...register("youtube")}
          />
        </div>

        <CardFooter>
            <PrimaryButton
            isDisabled={isSubmitting}
            >{socialAccounts ? 'Actualizar Datos' : 'Guardar Datos'}</PrimaryButton>
        </CardFooter>

      </CardAction>
      </form>

    </div>
  )
}
