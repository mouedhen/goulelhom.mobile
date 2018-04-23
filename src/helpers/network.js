let ApiUtils = {
    checkStatus: function (response) {
        // console.log(response)
        if (response.ok) {
            return response;
        } else {
            let error = new Error(response.statusText);
            error.response = response;
            throw error;
        }
    }
};

export {ApiUtils}