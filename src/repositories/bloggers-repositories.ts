

export const bloggers =[
    {id:1,name:'Ihor',youtubeUrl:'snocfjdsoifjs'},

];


export const bloggersRepositories = {
    async getBloggers(){
        return bloggers
    },

    async findBloggersById(id: number) {
        let blogger = bloggers.find(b => b.id === id)
       if(blogger) {
           return blogger;
       }else {
          return null;
       }

    },


    async createBlogger(name:string,youtubeUrl:string){
        
        const newBlogger={
            id:+(new Date()),
            name:name,
            youtubeUrl:youtubeUrl
        }
        bloggers.push(newBlogger)
        return (newBlogger)


    },
    async updateBloggers(id:number,name:string,youtubeUrl:string){
        let blogger = bloggers.find(b => b.id === id);
        if(blogger){
            blogger.name = name;
            blogger.youtubeUrl=youtubeUrl;
            return blogger;
        }
    },
    async deleteBloggers(id:number) {
        for (let i=0;i<bloggers.length;i++) {
            if (bloggers[i].id === id) {
                bloggers.splice(i, 1)
                return true;
            }
        }
        },
}
