import AssetTeaser from '../molecules/AssetTeaser'
import React from 'react'
import { QueryResult } from '@oceanprotocol/lib/dist/node/metadatastore/MetadataStore'
import { useLocation, useNavigate } from '@reach/router'
import Pagination from '../molecules/Pagination'
import { updateQueryStringParameter } from '../../utils'
import styles from './AssetList.module.css'
import { MetaDataMarket } from '../../@types/MetaData'
import { DDO } from '@oceanprotocol/lib'
import { useSiteMetadata } from '../../hooks/useSiteMetadata'

declare type AssetListProps = {
  queryResult: QueryResult
}

const AssetList: React.FC<AssetListProps> = ({ queryResult }) => {
  const { appConfig } = useSiteMetadata()
  const location = useLocation()
  const navigate = useNavigate()

  // Construct the urls on the pagination links. This is only for UX,
  // since the links are no <Link> they will not work by itself.
  function hrefBuilder(pageIndex: number) {
    const newUrl = updateQueryStringParameter(
      location.pathname + location.search,
      'page',
      `${pageIndex}`
    )
    return newUrl
  }

  // // This is what iniitates a new search with new `page`
  // // url parameter
  function onPageChange(selected: number) {
    const newUrl = updateQueryStringParameter(
      location.pathname + location.search,
      'page',
      `${selected + 1}`
    )
    return navigate(newUrl)
  }

  return (
    <>
      <div className={styles.assetList}>
        {queryResult && queryResult.totalResults > 0 ? (
          queryResult.results.map((ddo: DDO) => {
            const { attributes }: MetaDataMarket = ddo.findServiceByType(
              'metadata'
            )

            return (
              <AssetTeaser did={ddo.id} metadata={attributes} key={ddo.id} />
            )
          })
        ) : (
          <div className={styles.empty}>
            No results found in {appConfig.oceanConfig.metadataStoreUri}
          </div>
        )}
      </div>

      {/* 
        Little hack cause the pagination navigation only works 
        on the search page right now.
      */}
      {location.pathname === '/search' && queryResult && (
        <Pagination
          totalPages={queryResult.totalPages}
          currentPage={queryResult.page}
          hrefBuilder={hrefBuilder}
          onPageChange={onPageChange}
        />
      )}
    </>
  )
}

export default AssetList