#!/bin/bash
rsync -av --delete ./* -e "ssh -p 222" adcourses@srv.redstream.by:imbaesports-lp && curl -X DELETE "https://api.cloudflare.com/client/v4/zones/77aaebc6a4286a3da1643bd28de0b84f/purge_cache" -H "Authorization: Bearer TCLQdOxd_XJpnU4hIaeom6Km4LnYsLHbpHbD7JWr" -H "Content-Type:application/json" --data '{"purge_everything":true}'
