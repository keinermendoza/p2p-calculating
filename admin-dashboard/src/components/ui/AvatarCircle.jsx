export default function AvatarCircle({image}) {
  return (
    <>
    {image 
        ? <img className="bg-gray-500 rounded-full shadow-lg object-fit size-12" src={image} /> 
        : <div className="bg-gray-500 rounded-full shadow-lg object-fit size-12"></div>
    }
    </>
  )
}
