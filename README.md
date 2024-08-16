# cookie-banner-gdpr-request

Extract partners from cookie banners to request personal data (GDPR).

## Maturity

This is a Proof-of-Concept. By analysing a single news site the list of vendors
is extracted and saved.

The `vendors.csv` is meant to be curated by crowdwork to add a point of contact
to inquiry a machineable record of the personal data hold by that vendor.

## Architecture

Since Manifest Version 3 is required for Google Chrome going forward, there is
an implementation for it.

Manifest Version 2 is more capable and will have a separate implementation.
The code will be shared whenever possible and imported by both.

In order to preserve the privacy of people, `vendors.csv` will be baked into
the web extension / browser add-on and the list of vendors fetched in the
browser and compared against it. There will be a way to single out yet unknown
vendors to submit to this repository, so the list can grow.

## Ideas for the future

We could imagine collaborating with [ToS;DR](https://tosdr.org/) at some point.

## License

AGPL-3.0-only. See [LICENSE](./LICENSE)
