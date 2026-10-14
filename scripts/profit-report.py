"""Aggregate normalized private exports; never store raw exports in this repo.
Usage: python scripts/profit-report.py /private/cohorts.csv
Columns: campaign,variant,impressions,ad_clicks,spend,applications,approved,rejected,pending,approved_reward,variable_cost
Each row must be a mutually exclusive mature cohort, same currency/attribution window.
"""
import csv,json,sys
from collections import defaultdict
from decimal import Decimal
fields='impressions ad_clicks spend applications approved rejected pending approved_reward variable_cost'.split()
def report(path):
    groups=defaultdict(lambda:{k:Decimal(0) for k in fields})
    with open(path,newline='',encoding='utf-8-sig') as f:
        reader=csv.DictReader(f)
        for row in reader:
            values={k:Decimal(row[k]) for k in fields}
            if any(v<0 for v in values.values()):raise ValueError('negative counts or amounts; normalize refunds separately')
            if values['approved']+values['rejected']+values['pending']!=values['applications']:raise ValueError('application state totals do not match')
            for k,v in values.items():groups[(row['campaign'],row['variant'])][k]+=v
    def ratio(a,b):return float(a/b) if b else None
    return [dict(campaign=c,variant=v,**{k:float(x) for k,x in d.items()},ctr=ratio(d['ad_clicks'],d['impressions']),cpc=ratio(d['spend'],d['ad_clicks']),application_cvr=ratio(d['applications'],d['ad_clicks']),approval_rate=ratio(d['approved'],d['approved']+d['rejected']),approved_cpa=ratio(d['spend'],d['approved']),roas=ratio(d['approved_reward'],d['spend']),contribution=float(d['approved_reward']-d['spend']-d['variable_cost'])) for (c,v),d in groups.items()]
if __name__=='__main__':print(json.dumps(report(sys.argv[1]),ensure_ascii=False,indent=2))
