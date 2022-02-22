import Image from 'next/image'

const Card = ({ thumbnail }) => {
  return (
      <>
         <Image
            src={thumbnail.url}
            alt={thumbnail.title}
            className="card"
            width={200}
            height={200}
            priority
        />
      </>
  )
}

export default Card