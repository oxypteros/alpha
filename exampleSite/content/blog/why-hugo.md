+++
# Content Identity
title = "Why Hugo"
description = "A personal take on why Hugo won and not other static site generators or blogging platforms."
# Authoring
author = "oxypteros"
date = "2025-05-20T22:11:52+02:00"
lastmod = "2025-06-18T13:05:41+02:00"
license = "CC-BY"

# Organization
categories = ["Blog Posts"]
tags = ["Hugo", "Writing"]
## Series
series = "Two Why's and a How"
parts = "First Why"
weight = 2

# Display
featured = false
recommended = true


# Publication Control
draft = false
layout = "page"

# Advanced SEO
seo_type = "BlogPosting"
seo_image = ""
twitter_username = ""
+++

{{< status_card TITLE="Disclaimer" TYPE="info" >}}

This post series reflects my **personal experience**. Your mileage may vary!

{{< /status_card >}}

{{< text_snippet TITLE="It's too late">}}

I really think it's too late to ask _“Why Hugo?”_. You’re probably already using Hugo, or about to do so. And since **Alpha is built for Hugo**, it’s not like you’re comparing options.
Still, here's a wordy _why I chose Hugo for Alpha_ instead of another Jamstack tool or something more dynamic and _“modern”_.

{{< /text_snippet >}}

## A Little Insight

I love to write. You could say it's more than a need and less than a hobby.  
And because all words deserve to be read, I started publishing with tools that promised _everything_ (real-time previews, dozens of plugins, infinite configuration options).

At first, during the _“getting used to it”_ phase, it felt exciting. But over time, I realized I spent most of my time _fixing_ broken plugins, nervously _updating_ dependencies, and _digging_ through bloat... just to make a small change.

And doing all that for a **personal site**? Way too much.

To be fair, some of these tools are fantastic. They gave more than they took. But they never helped me **just write**.

See, I’m not someone who lets things be. I _have_ to tinker, tweak, fix what bothers me. And that led me to different platforms, (_dynamic_, _static_, _hybrid_) all of which I tried. Oddly, **Hugo** wasn’t one of them. I’d heard of it, sure. Just never used it.

## When Oxy Met Hugo

One day, I physically witnessed Hugo build a **huge** site, not dozens, but **thousands** of pages. And it built them _fast_.

Not _"pretty quick"_, but **shockingly fast**. The kind of fast that makes you think something must have gone wrong. But no, that's Hugo!

That same night, I stayed up exploring Hugo. I didn’t know **Go** (_still don’t_), and had zero experience with **Go templates**.
But in _fifteen minutes_, I had a working website with just:

- One config file
- Five or six theme templates[^1]

And more importantly:

- No databases
- No CMS to babysit
- No JS frameworks
- No weird server setup

And because it was static, it could be deployed **anywhere**.

Yes, other tools offer some of these benefits. But the total package, **simplicity, freedom, speed**, I hadn’t found it anywhere else.

Hugo can’t do _everything_, nothing really can. But if your focus is **text**, Hugo is (at least for me) the GOAT.

## Thank You for Nothing?

Did I just use ~300 words to repeat Hugo’s 7 word tagline?

> _"The world’s **fastest** framework for building websites."_  
> — [gohugo.io](https://gohugo.io/)

Yes. It seems like it.

Speed might not matter for small sites, a few hundred milliseconds here or there doesn’t change much. But when your content grows, Hugo’s speed becomes something you’ll **genuinely be grateful for**. And while its impressive speed initially caught my eye, and it's often the first thing people mention about Hugo, what ultimately sold me wasn't the speed.

It was the **simplicity**.

You don’t have to jump through hoops. Just **install a theme** and **start writing**.

Most personal sites don’t need more than Hugo’s _out-of-the-box_ functionality.  
But if you do need more? Hugo certainly won’t get in your way.

### And The Cherry on Top

If you pair Hugo with the **Alpha theme** (**_yes, shameless plug_**), your site won’t just build fast, it’ll be _even simpler_ to just start writing. But more on that on the next _why_.

[^1]: Used one of [Hugo's themes](https://themes.gohugo.io/)
