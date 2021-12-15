const RahulPredictionMarket = artifacts.require('PredictionMarket.sol');
  
const Side = {
  Rahul: 0,
  Modi: 1
};

contract('RahulPredictionMarket', addresses => {
  const [admin, oracle, gambler1, gambler2, gambler3, gambler4, _] = addresses;

  it('should work', async () => {
    const predictionMarket = await RahulPredictionMarket.new(oracle);
    
    await predictionMarket.placeBet(
      Side.Rahul, 
      {from: gambler1, value: web3.utils.toWei('1')}
    );
    await predictionMarket.placeBet(
      Side.Rahul, 
      {from: gambler2, value: web3.utils.toWei('1')}
    );
    await predictionMarket.placeBet(
      Side.Rahul, 
      {from: gambler3, value: web3.utils.toWei('2')}
    );
    await predictionMarket.placeBet(
      Side.Modi, 
      {from: gambler4, value: web3.utils.toWei('4')}
    );

    await predictionMarket.reportResult(
      Side.Rahul, 
      Side.Modi, 
      {from: oracle}
    );

    const balancesBefore = (await Promise.all( 
      [gambler1, gambler2, gambler3, gambler4].map(gambler => (
        web3.eth.getBalance(gambler)
      ))
    ))
    .map(balance => web3.utils.toBN(balance));
    await Promise.all(
      [gambler1, gambler2, gambler3].map(gambler => (
        predictionMarket.withdrawGain({from: gambler})
      ))
    );
    const balancesAfter = (await Promise.all( 
      [gambler1, gambler2, gambler3, gambler4].map(gambler => (
        web3.eth.getBalance(gambler)
      ))
    ))
    .map(balance => web3.utils.toBN(balance));

    assert(balancesAfter[0].sub(balancesBefore[0]).toString().slice(0, 3) === '199');
    assert(balancesAfter[1].sub(balancesBefore[1]).toString().slice(0, 3) === '199');
    assert(balancesAfter[2].sub(balancesBefore[2]).toString().slice(0, 3) === '399');
    assert(balancesAfter[3].sub(balancesBefore[3]).isZero());
  });
});