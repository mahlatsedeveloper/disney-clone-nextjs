
import {gql, GraphQLClient} from 'graphql-request'

const ChangeToSeen =  async ({ body }, res) => {

    const token = process.env.graphCmsToken
    const endpoint = process.env.graphCmsUrl
    console.log(endpoint)
    
    const graphcms = new GraphQLClient(endpoint, {
        headers: {
            authorization: `Authorization  ${token}`,
        },
    })

    await graphcms.request(
        gql`
            mutation($slug: String!) {
                updateVideo(where: {slug: $slug}, data: {seen: true}) {
                    id
                    title
                    seen
                }
            }
        `,
        {slug: body.slug}
    )

    await graphcms.request(
        gql`
            mutation publishVideo($slug: String!) {
                publishVideo(where: {slug: $slug}, to:PUBLISHED) {
                    id
                    slug
                }
            }
        `,
        {slug: body.slug}
    )

    res.status(200).json({ slug: body.slug})
}

export default ChangeToSeen