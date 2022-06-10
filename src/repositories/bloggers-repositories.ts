const bloggers =[
    {id:1,name:'Ihor',youtubeUrl:'snocfjdsoifjs'},
    {id:2,name:'Vasya',youtubeUrl:'dsaklmfokdso'},
    {id:3,name:'Petya',youtubeUrl:'skjidpjweipdji'},
    {id:4,name:'Borya',youtubeUrl:'zxpzkocomdcs'},

];


export const bloggersRepositories = {
    findBloggersById(id: number) {
        let blogger = bloggers.find(b => b.id === id)
        return blogger;

    },
    allBloggers : (bloggers),

    createBlogger(name:string,youtubeUrl:string){
        const newBlogger={
            id:+(new Date()),
            name:name,
            youtubeUrl:youtubeUrl
        }
        bloggers.push(newBlogger)
        return (newBlogger)


    },
    updateBloggers(id:number,name:string,youtubeUrl:string){
        let blogger = bloggers.find(b => b.id === id);
        if(blogger){
            blogger.name = name;
            blogger.youtubeUrl=youtubeUrl;
            return blogger;
        }
    },
    deleteBloggers(id:number){
        const index: any= bloggers.findIndex(b => b.id === id);

        if ( index){
            bloggers.splice(index,1)
            return true
        }else {
            return false
        }

    }

}
