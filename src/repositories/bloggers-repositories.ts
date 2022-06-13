export const bloggers =[
    {id:1,name:'Ihor',youtubeUrl:'snocfjdsoifjs'},

];

const errorid={
    "id": 0,
    "name": "string",
    "youtubeUrl": "string"
}

export const bloggersRepositories = {
    allBloggers : (bloggers),
    findBloggersById(id: number) {
        let blogger = bloggers.find(b => b.id === id)
       if(blogger) {
           return blogger;
       }else {
          return ;
       }

    },


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
    deleteBloggers(id:number) {
        for (let i=0;i<bloggers.length;i++) {
            if (bloggers[i].id === id) {
                bloggers.splice(i, 1)
                return true;
            }
        }
        },
}
