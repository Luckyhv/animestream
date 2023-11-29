const anilistdata = await fetch(`https://graphql.anilist.co`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: `query ($id: Int) {
              Media (id: $id) {
                mediaListEntry {
                  progress
                  status
                  customLists
                  repeat
                }
                id
                idMal
                title {
                  romaji
                  english
                  native
                }
                status
                genres
                episodes
                studios {
                  edges {
                    node {
                      id
                      name
                    }
                  }
                }
                bannerImage
                description
                coverImage {
                  extraLarge
                  color
                }
                synonyms
                  
              }
            }
          `,
      variables: {
        id: id,
      },
    }),
  });
  const response = (await anilistdata.json()).data.Media;