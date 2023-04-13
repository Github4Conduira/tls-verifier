import { JSDOM } from 'jsdom'
import { JSONPath } from 'jsonpath-plus'

describe('HTTP Provider Tests', () => {
	it('should parse xpath & JSON path', async() => {

		const dom = new JSDOM(html)
		const doc = dom.window.document
		const json = doc.evaluate('//script[@id=\'js-react-on-rails-context\']', doc, null, 2).stringValue
		const val = JSONPath({ path: '$..full_name', json:JSON.parse(json) })
		expect(val.length).toEqual(1)
		expect(val[0]).toEqual('John Dow')
	})
})


const html = `<!DOCTYPE html><html class="home index" lang="en"><head><title>Home | Bookface</title>
<div class="container page-body">
    <div class="content nomargin"><script type="application/json" id="js-react-on-rails-context">
    {"railsEnv":"production","inMailer":false,"i18nLocale":"en","i18nDefaultLocale":"en","rorVersion":"12.6.0","rorPro":false,"href":"https://bookface.ycombinator.com/home",
        "location":"/home","scheme":"https","host":"bookface.ycombinator.com","port":null,"pathname":"/home","search":null,"applyBatchLong":"Summer 2023",
        "applyBatchShort":"S2023","applyDeadlineShort":"April  7","ycdcRetroMode":false,
        "currentUser":{"id":123,"admin":false,"waas_admin":false,"yc_partner":false,
            "current_company":{"name":"test"},
            "company_for_deals":{"name":"test"},
            "full_name":"John Dow",
            "first_name":"John",
            "hnid":"johndow"},
        "serverSide":false}</script>
    </div>
</div>
</html>`