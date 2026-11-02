import {
    Body,
    Controller,
    Delete,
    Get,
    NotFoundException,
    Param,
    ParseIntPipe,
    Patch,
    Post,
} from "@nestjs/common";

interface Album {
    id: number;
    title: string;
    artist: string;
}

@Controller("/albums")
export class albumsController {
    private readonly albums: Album[] = [
        { id: 1, title: "Discovery", artist: "Daft Punk" },
        { id: 2, title: "Blue", artist: "Joni Mitchell" },
    ];
    private nextId = 3;

    @Get()
    getAlbums() {
        return this.albums;
    }

    @Get(":id")
    getAlbum(@Param("id", ParseIntPipe) id: number) {
        return this.findAlbum(id);
    }

    @Post()
    createAlbum(@Body() album: Omit<Album, "id">) {
        const newAlbum = { id: this.nextId++, ...album };
        this.albums.push(newAlbum);
        return newAlbum;
    }

    @Patch(":id")
    updateAlbum(
        @Param("id", ParseIntPipe) id: number,
        @Body() updates: Partial<Omit<Album, "id">>,
    ) {
        const album = this.findAlbum(id);
        Object.assign(album, updates);
        return album;
    }

    @Delete(":id")
    deleteAlbum(@Param("id", ParseIntPipe) id: number) {
        const index = this.albums.findIndex((album) => album.id === id);
        if (index === -1) {
            throw new NotFoundException(`Album ${id} was not found`);
        }

        this.albums.splice(index, 1);
        return { deleted: true, id };
    }

    private findAlbum(id: number) {
        const album = this.albums.find((item) => item.id === id);
        if (!album) {
            throw new NotFoundException(`Album ${id} was not found`);
        }
        return album;
    }
}
