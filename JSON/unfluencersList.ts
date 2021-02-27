interface InfluencersListProps {
  [code: string]: { name: string; discount: number };
}

const influencersList: InfluencersListProps = {
  TestCode10: { name: "Test Code", discount: 10 },
};

export default influencersList;
