import {useState} from 'react'
import Image from 'next/image'
import {gql, GraphQLClient} from 'graphql-request'
import NavBar from '../../components/NavBar'


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

    const variables = {
        pageSlug,
    }

    const data = await graphQLClient.request(query, variables)
    const video = data.video


    const accountData = await graphQLClient.request(accountQuery)
    const account = accountData.account

    return{
        props: {
            video,
            account,
        },
    }
}

const changeToSeen = async (slug) => {
    await fetch('/api/changeToSeen', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            slug,
        }),
    })
}

const Video = ({ video, account }) => {
    const [watching, setWatching] = useState(false)
  return (
    <>
        <NavBar account={account} />
        {!watching && (
            <>
                <Image
                    src={video.thumbnail.url}
                    alt={video.title}
                    className="video-image"
                    layout="fill"
                    priority
                />
                <div className="info">
                    <h2>{video.title}</h2>
                    <h2>{video.tags}</h2>
                    <p>{video.description}</p>
                    <button 
                        className="video-overlay"
                        onClick={() => {
                            changeToSeen(video.slug)
                            watching ? setWatching(false) : setWatching(true)}
                        }
                    >Play</button>
                </div>
            </>
        )}
        {watching && (
                <video width={'100%'} className="video" controls>
                    <source src={video.mp4.url} type="video/mp4" />
                </video>
            )
        }
        <div className="footer" onClick={() => watching ? setWatching(false) : null}></div>
    </>
  )
}

export default Video