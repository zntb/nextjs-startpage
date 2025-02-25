import classes from './exchange.module.css';

function Exchange() {
  return (
    <div>
      <div className={classes.exchangeRates}>
        <iframe
          style={{ width: '250px', height: '241px' }}
          frameBorder="0"
          marginWidth={0}
          marginHeight={0}
          scrolling="no"
          src="https://www.cursvalutar.ro/widget/?w=250&cft=114455&ctt=95A0B5&cc=000000&cfb=97b3bb&ct=060708&val=EUR,USD,GBP,HUF&font=12&logo=off&bold=bold&var=on&ct_b=bold&con=on&undefined=undefined"
        ></iframe>
      </div>
    </div>
  );
}

export default Exchange;
