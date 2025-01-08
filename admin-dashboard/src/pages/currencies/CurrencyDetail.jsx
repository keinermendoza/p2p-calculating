import { useEffect } from "react";
import { useParams, NavLink, useNavigate } from "react-router";
import { useForm, Controller } from "react-hook-form";
import { useFetchGet} from '../../hooks/fetcher';
import { fetchPostForm } from "../../services/fetchPost";
import { CardAction, CardFooter, PrimaryButton } from "../../components/ui";
import {ImageField, inputTextStyle} from "../../components/forms";
import {ModalDelete} from "../../components/ModalDelete";
import { ToastContainer, toast } from 'react-toastify';
import { ComeBackLink } from "../../components/ComeBackLink";
import { useMessageProvider } from "../../utils/MessageContext";

export  function CurrencyDetail() {
  let { id } = useParams();
  const navigate = useNavigate();
  const endpoint = "currencies/" + id;
  const {addMessage} = useMessageProvider();
  
  const {data:currency, loading, error} = useFetchGet(endpoint)
  const { register, handleSubmit, setValue, control, formState: { errors, isSubmitting } } = useForm();
  
  const onSubmit = async (data) => {
    const newData = {...data, "_method":"PUT"}
    const formData = new FormData();
    Object.entries(newData).forEach(([key, value]) => formData.append(key, value));
    const response = await fetchPostForm(endpoint, formData);

    if (!response.errors) {
      addMessage("Moneda actualizada con exito!");
      navigate("../");
    }

  }

  const deleteCurrency = async () => {
    try {
      const response = await fetch("/api/" + endpoint, {method: "DELETE"});
      if (!response.ok) {
        throw new Error();
      }

      addMessage("Moneda eliminada con exito!");
      navigate("../");
    } catch(err) {
      toast.error("No fue posible eliminar la moneda");
    }
  }

  // update fields when data is loaded  
  useEffect(() => {
    if (currency) {
      setValue( "name", currency.name); 
      setValue( "symbol", currency.symbol);
    }
  }, [currency]);


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

      <p>
        <NavLink to="../">Volver</NavLink>
      </p>
      <h1 className="text-3xl font-medium">Editando Moneda {currency?.name}</h1>

      <form className="max-w-sm" onSubmit={handleSubmit(onSubmit)} >
      <CardAction extraClass="gap-4">
        <div>
          <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Nombre de la Moneda</label>
          {errors.name && <p className="text-red-800 font-medium">{errors.name.message}</p>}
          <input 
          placeholder="Real" 
          className={inputTextStyle}
          {...register("name", 
          {
            required: {value: "Proporciona un nombre"},
            maxLength: {value:50, message: "el nombre debe tener maximo 50 letras"},
            minLength: {value:3, message: "el nombre debe tener minimo 3 letras"},
          }
          )}
          />
        </div>

        <div>
          <label htmlFor="symbol" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Simbolo</label>
          {errors.symbol && <p className="text-red-800 font-medium">{errors.symbol.message}</p>}
          <input 
          placeholder="R$" 
          className={inputTextStyle}
          {...register("symbol", 
            {
              required: "Proporciona un simbolo",
              maxLength: {value:5, message: "el simbolo debe tener maximo 8 letras"},
            }
          )}
          />
        </div>

     
        {/* https://claritydev.net/blog/react-hook-form-multipart-form-data-file-uploads */}
        {/* https://react-hook-form.com/docs/usecontroller/controller */}

          <Controller
            control={control}
            name={"image"}
            // rules={{ required: "Recipe picture is required" }}
            render={({ field: { value, onChange, ...field } }) => { // this line makes the magic
              return (
                <ImageField
                  {...field}
                  value={value?.fileName}
                  initialImage={currency?.image} 
                  onChange={(event) => {
                    onChange(event.target.files[0]);
                  }
                }
                />
              );
            }}
          />

        <CardFooter extraClass="justify-end">
          <PrimaryButton
            isDisabled={isSubmitting}
          
          >Guardar Cambios</PrimaryButton>
        </CardFooter>
      </CardAction>  
      </form>

      <div className="mt-12 w-full max-w-4xl flex flex-col sm:flex-row gap-4 justify-between items-center">
        <div className="w-full max-w-lg">
          <p className="text-lg mb-2">Eliminar Moneda</p>
          <p>Al eliminar esta moneda también se eliminará cualquier <b>Tipo de Cambio</b> en el que estés usando esta moneda</p>
        </div>

        <ModalDelete 
            isDisabled={isSubmitting}

        deleteButtonText="Eliminar Moneda"
        deleteCallback={deleteCurrency}>
          <h3 className="mb-2 text-lg text-gray-500 dark:text-gray-400">Estás seguro de que quieres eliminar esta Moneda?</h3>
          <p className="mb-5 text-left  text-sm px-2">Recuerda que al eliminar esta moneda tambien se eliminarán todos los <b>Tipos de Cambio</b> en la que esta aparezca.</p>
        </ModalDelete>
      </div>

    </section>
  )
}
