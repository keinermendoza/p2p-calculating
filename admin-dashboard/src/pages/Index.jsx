import { useState } from 'react';
import { useFetchGet} from '../hooks/fetcher';
import { SimpleCard, OutlinedCard, RowInfo } from "../components/ui";
import React from 'react';
import List from './List';
import Detail from './Detail';

export default function Index() {
const endpoint = "/api/exchanges";
const {data:exchangeData, error} = useFetchGet(endpoint);
const [isDetailView, setIsDetailView] = useState(false);
const [detailViewData, setDetailViewData] = useState({})


const choiceExchange = (isToVes, index) => {
  let sectionKey = "rates_from_ves";
  if(isToVes) {
    sectionKey = "rates_to_ves";
  }
  setIsDetailView(true);
  setDetailViewData({
    "exchange": exchangeData[sectionKey][index],
    "margin": exchangeData.profit_margin,
    "position": exchangeData.selected_position
  });
}

console.log(exchangeData)

  return (
    isDetailView ? (
      <Detail 
      data={detailViewData}
      setIsDetailView={setIsDetailView}
      />
    ) : (
      <List 
      exchangeData={exchangeData}
      setIsDetailView={setIsDetailView}
      choiceExchange={choiceExchange}
      />
    )
  )
}


