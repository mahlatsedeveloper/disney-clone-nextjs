import Image from 'next/image'
import {gql, GraphQLClient} from 'graphql-request'
import Section from '../components/Section'
import NavBar from '../components/NavBar'


export const getStaticProps = async () => {
  const token = process.env.graphCmsToken
  const endpoint = process.env.graphCmsUrl

  const graphQLClient = new GraphQLClient(endpoint, {
    headers: {
      authorization: `Bearer  ${token}`,
    },
  })

  const videosQuery = gql`
    query{
      videos{
        createdAt
        id
        title
        slug
        description
        seen
        tags
        thumbnail{
          fileName
          url
        }
        mp4{
          fileName
          url
        }
      }
    }
  `
  const accountQuery = gql`
    query{
      account(where: {id: "ckzybqre83rma0d15ii2mgqxa"}){
        username
        avatar {
          id
          url
        }
      }
  }`

  const data = await graphQLClient.request(videosQuery)
  const videos = data.videos

  const accountData = await graphQLClient.request(accountQuery)
  const account = accountData.account

  return {
    props: {
      videos,
      account,
    },
  }
}


const Home = ({ videos, account }) => {
  const randomVideo = (videos) => {
    return videos[Math.floor(Math.random() * videos.length)]
  }

  const filterVideos = (videos, genre) => {
    return videos.filter((video) => video.tags.includes(genre))
  }
  const useSeenVideos = (videos) =>{
    return videos.filter((video) => video.seen == false || video.seen == null)
  }
  return (
    <>
      <NavBar account={account} />
      <div className="app">
        <div className="main-video">
          <Image
            src={randomVideo(videos).thumbnail.url}
            alt={randomVideo(videos).thumbnail.title}
            className="image"
            layout="fill"
            priority
        />
        </div>

        <div className="video-feed">
          <Section genre={'Recommended for you'} videos={useSeenVideos(videos)} />
          { filterVideos(videos, "family").length > 0 &&
          <Section genre={'Family'} videos={filterVideos(videos, "family")} />
          }
          { filterVideos(videos, "classic").length > 0 &&
            <Section genre={'Classic'} videos={filterVideos(videos, "classic")} />
          }
          { filterVideos(videos, "funny").length > 0 &&
            <Section genre={'Funny'} videos={filterVideos(videos, "funny")} />
          }
          { filterVideos(videos, "animals").length > 0 &&
            <Section genre={'Animals'} videos={filterVideos(videos, "animals")} />
          }
          { filterVideos(videos, "thriller").length > 0 &&
            <Section genre={'Thriller'} videos={filterVideos(videos, "thriller")} />
          }
          { filterVideos(videos, "drama").length > 0 &&
            <Section genre={'Drama'} videos={filterVideos(videos, "drama")} />
          }
        </div>
      </div>
    </>
  )
}

export default Home