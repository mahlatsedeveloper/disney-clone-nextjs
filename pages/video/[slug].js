import Image from 'next/image'
import Link from 'next/link'
import {gql, GraphQLClient} from 'graphql-request'


export const getServerSideProps = async (pageContext) => {
    const token = process.env.graphCmsToken
    const endpoint = process.env.graphCmsUrl

    const graphQLClient = new GraphQLClient(endpoint, {
        headers: {
        authorization: `Bearer  ${token}`,
        },
    })

    const pageSlug = pageContext.query.slug

    const query = gql`
        query($pageSlug: String!){
            video(where: {slug: $pageSlug}){
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

    const variables = {
        pageSlug,
    }

    const data = await graphQLClient.request(query, variables)
    const video = data.video

    return{
        props: {
            video,
        },
    }
}

const Video = ({ video }) => {
  return (
    <>
        <div className="app">
            <div className="main-video">
                <Link href="/">
                    <a className="back-link">
                        Home
                    </a>
                </Link>
                <h2>{video.title}</h2>
                <p>{video.description}</p>
                <Image
                    src={video.thumbnail.url}
                    alt={video.title}
                    width={500}
                    height={500}
                    priority
                />
            </div>
        </div>
    </>
  )
}

export default Video