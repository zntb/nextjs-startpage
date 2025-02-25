import classes from './exchange.module.css';

function Exchange() {
  const widgetHtml = `
    <div style="width:198px;border:1px solid #1094A5;">
      <div style="text-align:center;background-color:#1094A5;width:100%;font-size:13px;font-weight:bold;height:18px;padding-top:2px;">
        <a href="https://www.exchangeratewidget.com/" style="color:#FFFFFF;text-decoration:none;" rel="nofollow">Currency Converter</a>
      </div>
      <script type="text/javascript" src="https://www.exchangeratewidget.com/converter.php?l=en&f=USD&t=EUR&a=1&d=CEDFDE&n=FFFFFF&o=000000&v=1"></script>
    </div>
  `;
  return (
    <div>
      <div className={classes.exchangeRates}>
        <div
          suppressHydrationWarning
          dangerouslySetInnerHTML={{ __html: widgetHtml }}
        />
      </div>
    </div>
  );
}

export default Exchange;
