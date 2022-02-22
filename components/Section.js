import Link from 'next/link'
import Card from './Card'

const Section = ({genre, videos}) => {
  return (
    <div className={"section"}>
        <h3>{genre}</h3>
        <div className="video-feed">
            {videos.map((video) => (
                <Link href={`/video/${video.slug}`} key={video.id}>
                    <a className="card-link">
                        <Card thumbnail={video.thumbnail} />
                    </a>
                </Link>
            ))}
        </div>
    </div>
  )
}

export default Section