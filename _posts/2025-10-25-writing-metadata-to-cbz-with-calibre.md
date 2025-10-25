---
layout:   post
title:    "Writing metadata to CBZ files with Calibre"
subtitle: "Update your comics and manga files."
date:     2025-10-25 18:16:12 +0100
image:
  hero:   true
  path:   /assets/images/bookcase.png
  alt:    "Drawing of a large bookcase."
---

Comic books and mangas are usually stored as comic book archives, a type of file for the purpose of sequential viewing of images. This archive file is not a distinct file format but merely a filename extension naming convention. The filename extension indicates the archive type used:

- `.cb7` → 7z
- `.cbr` → RAR
- `.cbz` → ZIP

I recommend sticking to `.cbz` for compatibility and speed. All images inside the archive should already be compressed (using [Oxipng], for example). Compressed data doesn't compress well, so it's unlikely that `.cb7` improves much. And an ebook reader may be slower to open such a file or not open it at all.

---

To write metadata (such as the author or publisher) to a CBZ file, we can use [Calibre] with the [EmbedComicMetadata] plugin. After updating the book on Calibre, select it and click the EmbedComicMetadata icon in the toolbar to embed the metadata in the archive file. To verify that everything worked correctly, unzip the CBZ file (using [7-Zip], for example) and check that it contains a `ComicInfo.xml` file. Here's an example of such a file:

```xml
<?xml version="1.0"?>
<ComicInfo xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema">
  <Title>Scott Pilgrim's Precious Little Life</Title>
  <Series>Scott Pilgrim</Series>
  <Number>1.0</Number>
  <Year>2004</Year>
  <Month>8</Month>
  <Day>15</Day>
  <Writer>Bryan Lee O'Malley</Writer>
  <Publisher>Oni Press</Publisher>
</ComicInfo>
```

This file spec originated from the ComicRack application, which is not developed anymore. For the longest time there was no standards body responsible for maintaining this spec, but a coalition of players in the comic book space have joined forces to do [just that][The Anansi Project].


[Oxipng]: https://github.com/oxipng/oxipng
[Calibre]: https://calibre-ebook.com/
[EmbedComicMetadata]: https://github.com/dickloraine/EmbedComicMetadata
[7-Zip]: https://www.7-zip.org/
[The Anansi Project]: https://github.com/anansi-project/comicinfo
