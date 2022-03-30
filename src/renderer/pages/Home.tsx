import {
  PlaylistApiNames,
  fetchRecommendedPlaylists,
  fetchDailyRecommendPlaylists,
} from '@/api/playlist'
import CoverRow from '@/components/CoverRow'
import DailyTracksCard from '@/components/DailyTracksCard'
import FMCard from '@/components/FMCard'

export default function Home() {
  const {
    data: recommendedPlaylists,
    isLoading: isLoadingRecommendedPlaylists,
  } = useQuery(
    PlaylistApiNames.FETCH_RECOMMENDED_PLAYLISTS,
    () => {
      return fetchRecommendedPlaylists({})
    },
    {
      // placeholderData: () =>
      //   window.ipcRenderer.sendSync('getApiCacheSync', { api: 'personalized' }),
    }
  )

  const {
    data: dailyRecommendPlaylists,
    isLoading: isLoadingDailyRecommendPlaylists,
  } = useQuery(
    PlaylistApiNames.FETCH_DAILY_RECOMMEND_PLAYLISTS,
    fetchDailyRecommendPlaylists
  )

  const playlists = [
    ...(dailyRecommendPlaylists?.recommend ?? []),
    ...(recommendedPlaylists?.result ?? []),
  ].slice(0, 10)

  return (
    <div>
      <CoverRow
        title='推荐歌单'
        playlists={playlists}
        isSkeleton={
          isLoadingRecommendedPlaylists || isLoadingDailyRecommendPlaylists
        }
      />

      <div className='mt-10 mb-4 text-[28px] font-bold text-black dark:text-white'>
        For You
      </div>
      <div className='grid grid-cols-2 gap-6'>
        <DailyTracksCard />
        <FMCard />
      </div>
    </div>
  )
}