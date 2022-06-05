import { css, cx } from '@emotion/css'
import PlayLikedSongsCard from '@/web/components/New/PlayLikedSongsCard'
import PageTransition from '@/web/components/New/PageTransition'
import useUserArtists from '@/web/api/hooks/useUserArtists'
import ArtistRow from '@/web/components/New/ArtistRow'
import Tabs from '@/web/components/New/Tabs'
import { useMemo, useState } from 'react'
import CoverRow from '@/web/components/New/CoverRow'
import useUserPlaylists from '@/web/api/hooks/useUserPlaylists'
import useUserAlbums from '@/web/api/hooks/useUserAlbums'
import useUserListenedRecords from '@/web/api/hooks/useUserListenedRecords'
import useArtists from '@/web/api/hooks/useArtists'

const tabs = [
  {
    id: 'playlists',
    name: 'Playlists',
  },
  {
    id: 'albums',
    name: 'Albums',
  },
  {
    id: 'artists',
    name: 'Artists',
  },
  {
    id: 'videos',
    name: 'Videos',
  },
]

const My = () => {
  const { data: artists } = useUserArtists()
  const { data: playlists } = useUserPlaylists()
  const { data: albums } = useUserAlbums()
  const [selectedTab, setSelectedTab] = useState(tabs[0].id)

  const { data: listenedRecords } = useUserListenedRecords({ type: 'week' })
  const recentListenedArtistsIDs = useMemo(() => {
    const artists: {
      id: number
      playCount: number
    }[] = []
    listenedRecords?.weekData?.forEach(record => {
      const artist = record.song.ar[0]
      const index = artists.findIndex(a => a.id === artist.id)
      if (index === -1) {
        artists.push({
          id: artist.id,
          playCount: record.playCount,
        })
      } else {
        artists[index].playCount += record.playCount
      }
    })

    return artists
      .sort((a, b) => b.playCount - a.playCount)
      .slice(0, 5)
      .map(artist => artist.id)
  }, [listenedRecords])
  const { data: recentListenedArtists } = useArtists(recentListenedArtistsIDs)

  return (
    <PageTransition>
      <div className='grid grid-cols-1 gap-10'>
        <PlayLikedSongsCard />
        <div>
          <ArtistRow
            artists={recentListenedArtists?.map(a => a.artist)}
            title='RECENTLY LISTENED'
          />
        </div>

        <div>
          <Tabs
            tabs={tabs}
            value={selectedTab}
            onChange={(id: string) => setSelectedTab(id)}
          />
          <CoverRow playlists={playlists?.playlist} className='mt-6' />
        </div>
      </div>
    </PageTransition>
  )
}

export default My